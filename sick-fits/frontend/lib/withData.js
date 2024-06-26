import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/link-error';
import { getDataFromTree } from '@apollo/client/react/ssr';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import withApollo from 'next-with-apollo';
import {graphqlEndpoint} from "../config";
import paginationField from "./paginationField";

/*const middlewareUpdate = createUploadLink(
    {
      uri: 'http://localhost:3000/api/graphql'
    });
const authLink = setContext((_, { headers }) => {
  // Leer el storage almacenado
  const token = localStorage.getItem("token");
  // console.log(token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Apollo-Require-Preflight': 'true'
    },
  };
});*/

function createClient({ headers, initialState }) {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
              console.log(
                  `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              )
          );
        if (networkError)
          console.log(
              `[Network error]: ${networkError}. Backend is unreachable. Is it running?`
          );
      }),
      // this uses apollo-link-http under the hood, so all the options here come from that package
      createUploadLink({
        uri: 'http://localhost:3000/api/graphql',
        fetchOptions: {
          credentials: 'include'
        },
        // pass the headers along from this request. This enables SSR with logged in state
        headers,
      }),
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            products: paginationField(),
          },
        },
      },
    }).restore(initialState || {}),
  });
}

export default withApollo(createClient, { getDataFromTree });