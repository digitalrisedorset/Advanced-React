import { createAuth } from '@keystone-6/auth';
import { sendPasswordResetEmail } from './lib/mail';

// withAuth is a function we can use to wrap our base configuration
export const { withAuth } = createAuth({
    // this is the list that contains our users
    listKey: 'User',
    // an identity field, typically a username or an email address
    identityField: 'email',
    // a secret field must be a password field type
    secretField: 'password',
    // initFirstItem enables the "First User" experience, this will add an interface form
    //   adding a new User item if the database is empty
    //
    // WARNING: do not use initFirstItem in production
    //   see https://keystonejs.com/docs/config/auth#init-first-item for more
    initFirstItem: {
        // the following fields are used by the "Create First User" form
        fields: ['email', 'password'],
        itemData: { isAdmin: true },
        skipKeystoneWelcome: false,
    },
    // add isAdmin to the session data
    sessionData: 'id name email isAdmin',
    passwordResetLink: {
        sendToken: async ({ itemId, identity, token, context }) => {
            console.log({ itemId, identity, token })
            //await sendPasswordResetEmail(token, identity);
        },
        tokensValidForMins: 60,
    },
    magicAuthLink: {
        sendToken: async ({ itemId, identity, token, context }) => {
            console.log({ itemId, identity, token, context })
        },
        tokensValidForMins: 60,
    },
})
