import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App';
import { ApolloClient, ApolloProvider as Apollo, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { IconContext as Icon } from 'react-icons'
import { BrowserRouter as Router } from 'react-router-dom'
import cache from './cache'
import config from './utils/config'
// import history from './utils/history'


const { SERVER_URL } = config


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

const httpLink = new HttpLink({ uri: SERVER_URL })
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

