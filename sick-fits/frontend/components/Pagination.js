import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';
import PaginationPrev from "./PaginationPrev";
import PaginationNext from "./PaginationNext";

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    productsCount
  }
`;

export default function Pagination({ page }) {
  //const navigate = useNavigate()
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  if (loading) return 'Loading...';
  if (error) return <DisplayError error={error} />;
  const { productsCount } = data;
  const pageCount = Math.ceil(productsCount / perPage);

    if (page < 1) {
        navigate(`/products`)
    }

  if (page > pageCount) {
      //navigate(`/products/${pageCount}`)
  }

  return (
    <PaginationStyles>
      <p>
        <title>
          Sick Fits - Page {page} of {pageCount}
        </title>
      </p>
      <PaginationPrev page={page} />
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{productsCount} Items Total</p>
      <PaginationNext page={page} pageCount={pageCount} />
    </PaginationStyles>
  );
}
