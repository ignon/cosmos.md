import { LOGIN } from './query'
import { useMutation } from "@apollo/client";

const useLogin = ({ onCompleted }) => {
  const [login] = useMutation(LOGIN, {
    onCompleted: async ({ login }) => {
      const token = (login?.token)

      if (token) {
        localStorage.setItem('token', token)
        await new Promise(r => setTimeout(r, 200))
      }

      onCompleted?.()
    }
  })

  return [login]
}

export default useLogin