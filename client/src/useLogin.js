import { LOGIN, REGISTER } from './query'
import { useApolloClient, useMutation } from "@apollo/client";
import { useHistory } from 'react-router';

const useLogin = ({ onCompleted }={}) => {

  const setToken = async (obj) => {
    const token = obj?.token
    if (token) {
      localStorage.setItem('token', token)
      await new Promise(r => setTimeout(r, 200))
    }
  }

  const history = useHistory()
  const client = useApolloClient()


  const [login] = useMutation(LOGIN, {
    onCompleted: async ({ login }) => {
      await setToken(login)
      onCompleted?.()
    },
    onError: (err) => {
      alert(`Failed to login: ${err.message}`)
    }
  })

  const [register] = useMutation(REGISTER, {
    onCompleted: async ({ register }) => {
      client.clearStore()
      await setToken(register)
      onCompleted?.()
    },
    onError: (err) => {
      alert(`Failed to register: ${err.message}`)
    }
  })


  const wrapperLogin = ({ username, password }) => {
    login({
      variables: {
        username,
        password
      }
    })
  }

  const wrappedRegister = ({ username, password, displayName }) => {
    register({
      variables: {
        username,
        password,
        displayName
      },
      onError: () => {
        alert('inline error')
      }
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    client.clearStore()
    client.resetStore()
    history.go(0)
  }

  const isLoggedIn = Boolean(localStorage.getItem('token'))
  return {
    login: wrapperLogin,
    register: wrappedRegister,
    logout,
    isLoggedIn
  }
}

export default useLogin