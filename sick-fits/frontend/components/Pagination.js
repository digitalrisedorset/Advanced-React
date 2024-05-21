import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';
import {useRouter} from "next/router";

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    productsCount
  }
`;

export default function Pagination({ page }) {
    const router = useRouter()
    const { error, loading, data } = useQuery(PAGINATION_QUERY);
    if (loading) return 'Loading...';
    if (error) return <DisplayError error={error} />;
    const { productsCount } = data;
    const pageCount = Math.ceil(productsCount / perPage);

    if (page < 1) {
        router.push({
            pathname: `/products`
        })
    }

    if (page > pageCount) {
        router.push({
            pathname: `/products/${pageCount}`
        })
    }

    return (
        <PaginationStyles>
            <Head>
                <title>
                    Rise Dorset - Page {page} of {pageCount}
                </title>
            </Head>
            <Link href={`/products/${page - 1}`}>
                <span aria-disabled={page <= 1}>← Prev</span>
            </Link>
            <p>
                Page {page} of {pageCount}
            </p>
            <p>{productsCount} Items Total</p>
            <Link href={`/products/${page + 1}`}>
                <span aria-disabled={page >= pageCount}>Next →</span>
            </Link>
        </PaginationStyles>
    );
}