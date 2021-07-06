import { useMutation, useApolloClient } from "@apollo/client";
import { LOGIN } from "./query";

const TopBar = ({ refetchNotes }) => {
  const client = useApolloClient()
  const [login] = useMutation(LOGIN)

  const userLogin = () => { 
    console.log('--- LOGIN ---')
    login({
      variables: {
        username: 'TestUser',
        password: 'Password'
      }
    })
    .then(async result => {
      const { token } = result.data.login
      localStorage.setItem('token', token)
      await new Promise(r => setTimeout(r, 100)); //idk storage.setItem is slow???
      refetchNotes()
    })
  }

  const userLogout = async () => {
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <button onClick={userLogin}>Login</button>
      <button onClick={userLogout}>Logout</button>
    </div>
  )
}

export default TopBar