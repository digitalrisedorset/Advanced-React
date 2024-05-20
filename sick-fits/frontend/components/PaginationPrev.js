import Link from "next/link";

export default function PaginationPrev({page}) {
    return (
    <>
        {page>1 && (
            <Link href={`/products/${page - 1}`}>
                <span aria-disabled={page <= 1}>← Prev</span>
            </Link>
        )}
        {page===1 && (
            <Link href={`/products`}>
                <span aria-disabled={page <= 1}>← Prev</span>
            </Link>
        )}
    </>
    )
}