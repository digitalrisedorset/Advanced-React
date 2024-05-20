import {KeystoneContext} from "@keystone-6/core/types";

export default function addToCart(root: any, { productId }: { productId: string }, context: KeystoneContext)
{
    console.log('Adding to cart')
}