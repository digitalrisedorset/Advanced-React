import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { perPage } from '../config';
import Product from './Product';
import Pagination from "./Pagination";

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($take: Int, $skip: Int!) {
    products(take: $take, skip: $skip) {
      id
      name
      price
      description
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export default function Products({page}) {
  const pageNumber = parseInt(page)

  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      skip: (pageNumber) * perPage - perPage,
      take: perPage,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <ProductsListStyles>
      {data.products.map((product) => (
          <Product key={product.id} product={product} />
      ))}
    </ProductsListStyles>
  );
}
