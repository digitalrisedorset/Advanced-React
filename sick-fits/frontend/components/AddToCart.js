import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';
import styled from "styled-components";

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

const AddToCartButton = styled.button`
  background: var(--red);
  color: white;
  font-weight: 200;
  border: 0;
  border-radius: 0;
  text-transform: uppercase;
  font-size: 1rem;
  padding: 0.8rem 1.5rem;
  transform: skew(-2deg);
  display: inline-block;
  transition: all 0.5s;
  &[disabled] {
    opacity: 0.5;
  }
`;

export default function AddToCart({ id }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <AddToCartButton disabled={loading} type="button" onClick={addToCart}>
      Add{loading && 'ing'} To Cart 🛒
    </AddToCartButton>
  );
}
