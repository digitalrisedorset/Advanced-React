import Link from "next/link"
import CartCount from './CartCount';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';
import { useCart } from "../lib/cartState";

export default function Nav() {
    const user = useUser();
    const { toggleCart } = useCart()

    return (
        <NavStyles>
            <Link href="/products">Products</Link>
            {user && (
                <>
                    <Link href="/orders">Orders</Link>
                    <Link href="/account">Account</Link>
                    <SignOut />
                    <button type="button" onClick={toggleCart}>
                        My Cart
                        <CartCount count={user.cart.reduce(
                            (tally, cartItem) => tally + cartItem.quantity, 0
                        )} />
                    </button>
                </>
            )}
            {!user && (
                <>
                    <Link href="/signin">Sign In</Link>
                </>
            )}
        </NavStyles>
    );
}
