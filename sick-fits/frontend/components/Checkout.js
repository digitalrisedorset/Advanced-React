import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
    CardElement,
    Elements,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import SickButton from "./styles/SickButton";
import {useState} from "react";
import nProgress from 'nprogress'
import gql from "graphql-tag";
import {useMutation} from "@apollo/client";
import {useRouter} from "next/router";
import {CURRENT_USER_QUERY} from "./User";
import {useCart} from "../lib/cartState";

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CREATE_ORDER_MUTATION = gql`
  mutation Checkout($token: String!) {
    checkout(token: $token) {
      id
      total
      charge
      items {
        id
        name
      }
    }
  }
`;

function CheckoutForm() {
    const router = useRouter()
    const [error, setError] = useState()
    const [loading, setLoading] = useState()
    const stripe = useStripe()
    const elements = useElements()
    const { closeCart } = useCart()

    const [checkout, { graphqlError }] = useMutation(CREATE_ORDER_MUTATION, {
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
    });

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        nProgress.start()
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        })
        console.log(paymentMethod)
        if (error) {
            setError(error)
            nProgress.done()
            return
        }

        const order = await checkout({
            variables: {
                token: paymentMethod.id
            }
        })
        console.log('Order placed on stripe', order.data.checkout.id)

        closeCart()

        setLoading(false)
        nProgress.done()

        router.push({
            pathname: '/order/[id]',
            query: { id: order.data.checkout.id}
        })
    }

    return (
        <CheckoutFormStyles onSubmit={handleSubmit}>
            { error && <p style={{fontSize: 12}}>{error.message}</p>}
            { graphqlError && <p style={{fontSize: 12}}>{graphqlError.message}</p>}
            <CardElement />
            <SickButton>Checkout Now</SickButton>
        </CheckoutFormStyles>
    )
}

export default function Checkout() {
    return <Elements stripe={stripeLib}>
        <CheckoutForm />
    </Elements>
}