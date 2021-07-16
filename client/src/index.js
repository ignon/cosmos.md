import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, ApolloProvider as Apollo, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { IconContext as Icon } from 'react-icons'
import { BrowserRouter as Router } from 'react-router-dom'
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

const iconOptions = {
  className: 'react-icons'
}


ReactDOM.render(
  <StrictMode>
    <Router>
      <Apollo client={client}>
        <Icon.Provider value={iconOptions}>
          <App />
        </Icon.Provider>
      </Apollo>
    </Router>
  </StrictMode>,

  document.getElementById('root')
);

