import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ALL_NOTES, LOGIN, REGISTER } from "./query";

function App() {
  const [token, setToken] = useState(null)
  const [login, result] = useMutation(LOGIN)

  const result2 = useQuery(ALL_NOTES)

  useEffect(() => {
    login({
      variables: {
        username: 'arde',
        password: '123jeejeejoo'
      }
    })
      .then(result => {
        const { token } = result.data.login
        console.log({ token })
        setToken(token)
        localStorage.setItem('cratemd-user-token', token)
      })
      .catch(err => {
        console.log(err)
      })
  }, [login])



  console.log(result2)

  return (
    <div>Moi:3</div>
  )
}

export default App;