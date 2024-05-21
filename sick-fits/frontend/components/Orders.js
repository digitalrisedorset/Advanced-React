import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import ErrorMessage from '../components/ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import {useUser} from "./User";
import {perPage} from "../config";
import {ALL_PRODUCTS_QUERY} from "./Products";

export const USER_ORDERS_QUERY = gql`
  query Orders($where: OrderWhereInput!, $orderBy: [OrderOrderByInput!]!) {
    orders(where: $where, orderBy: $orderBy) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
    return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
    const me = useUser();
    if (!me) return null;

    const { data, error, loading } = useQuery(USER_ORDERS_QUERY, {
        variables: {
            where: { user: { id: { equals:me.id } }},
            orderBy: { createdAt: "desc" }
        },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <ErrorMessage error={error} />;
    const { orders } = data;
    return (
        <div>
            <Head>
                <title>Your Orders ({orders.length})</title>
            </Head>
            <h2>You have {orders.length} orders!</h2>
            <OrderUl>
                {orders.map((order) => (
                    <OrderItemStyles key={order.id}>
                        <Link href={`/order/${order.id}`}>
                            <span>
                                <div className="order-meta">
                                    <p>Created at:<br/>
                                        {new Date(order.createdAt).toLocaleDateString()}<br/>
                                        {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                    <p>Number Products: <br/>{countItemsInAnOrder(order)} Item
                                        {countItemsInAnOrder(order) === 1 ? '' : 's'}
                                    </p>
                                    <p>Total: <br/>{formatMoney(order.total)}</p>
                                </div>
                                <div className="images">
                                    {order.items.map((item) => (
                                        <img
                                            key={`image-${item.id}`}
                                            src={item.photo?.image?.publicUrlTransformed}
                                            alt={item.name}
                                        />
                                    ))}
                                </div>
                            </span>
                        </Link>
                    </OrderItemStyles>
                ))}
            </OrderUl>
        </div>
    );
}
