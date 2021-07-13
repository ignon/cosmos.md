import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, ApolloProvider, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { IconContext } from 'react-icons'
import cache from './cache'



const authLink = setContext((req, ctx) => {
  const { headers } = ctx
  const token = localStorage.getItem('token')

  console.log('setContext:', req.operationName, { token })

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' })
const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
  onError: ({ networkError, graphQLErrors }) => {
    graphQLErrors && console.log(graphQLErrors)
    networkError && console.log(networkError)
  }
})



ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <IconContext.Provider value={{ className: 'react-icons'}}>
        <App />
      </IconContext.Provider>
    </ApolloProvider>
  </React.StrictMode>,

  document.getElementById('root')
);

