import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';
import {CURRENT_USER_QUERY} from "./User";

const RESET_MUTATION = gql`
  mutation RedeemUserPasswordResetToken($email: String!, $password: String!, $token: String!) {
    redeemUserPasswordResetToken(email: $email, token: $token, password: $password) {
      message
      code
    }
  }
`;

export default function ResetPassword() {
    const { inputs, handleChange, resetForm } = useForm({
        email: '',
        password: '',
        token: ''
    });
    const [resetpassword, { data, loading, error }] = useMutation(
        RESET_MUTATION,
        {
            variables: inputs,
            // refectch the currently logged in user
            refetchQueries: [{ query: CURRENT_USER_QUERY }],
        }
    );

    async function handleSubmit(e) {
        e.preventDefault(); // stop the form from submitting
        const res = await resetpassword().catch(console.error);
        //resetForm();
        console.log('resetpassword', res)
        // Send the email and password to the graphqlAPI  token: 'Vl_KYD5-i_l3DySiYjZl'  ttt
    }

    return (
        <Form method="POST" onSubmit={handleSubmit}>
            <h2>Reset your password</h2>
            <Error error={error} />
            <fieldset>
                {data?.redeemUserPasswordResetToken?.code === 'TOKEN_REDEEMED' && (
                    <p>Success! Your password is now reset!</p>
                )}

                <label htmlFor="email">
                    Email
                    <input
                        required
                        type="email"
                        name="email"
                        placeholder="Your Email Address"
                        autoComplete="email"
                        value={inputs.email}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        required
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="password"
                        value={inputs.password}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="token">
                    Token
                    <input
                        required
                        type="password"
                        name="token"
                        placeholder="Token"
                        autoComplete="token"
                        value={inputs.token}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Submit Password</button>
            </fieldset>
        </Form>
    );
}
