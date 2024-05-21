import {useUser} from "./User";
import Form from "./styles/Form";
import {useRouter} from "next/router";

export default function UserDetails() {
    const router = useRouter()
    const user = useUser();

    if (!user) {
        router.push({
            pathname: 'products'
        })
    }

    return (
        <Form>
            <h2>Your details</h2>
            <fieldset>
                <label htmlFor="name">
                    Your Name
                    <input
                        type="text"
                        name="name"
                        value={user?.name}
                        disabled
                    />
                </label>
                <label htmlFor="email">
                    Your Email
                    <input
                        type="text"
                        name="name"
                        value={user?.email}
                        disabled
                    />
                </label>
            </fieldset>
        </Form>
    )
}