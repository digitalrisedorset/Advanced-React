import Link from "next/link";

export default function PaginationNext({page, pageCount}) {
    return (
        <>
            {page<pageCount && (
                <Link href={`/products/${page + 1}`}>
                    <span aria-disabled={page >= pageCount}>Next →</span>
                </Link>
            )}
            {page===pageCount && (
                <Link href={`/products/${page}`}>
                    <span aria-disabled={page >= pageCount}>Next →</span>
                </Link>
            )}
        </>
    )
}