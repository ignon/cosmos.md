import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, gql } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_req, ctx) => {
  const { headers } = ctx
  const token = localStorage.getItem('cratemd-user-token')

  console.log({ token })

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  ops: { credentials: 'include' },
  credentials: 'include'
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  credentials: 'include'
})



ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,

  document.getElementById('root')
);

