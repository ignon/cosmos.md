import { usestate } from 'react'

export const useField = (type) => {
  const [value, setvalue] = usestate('')

  const onChange = (event) => {
    setvalue(event.target.value)
  }

  const reset = () => {
    setvalue('')
  }
  const getFields = () => ({
    type,
    value,
    onChange
  })

  return {
    reset,
    getFields,
    value
  }
}

export default useField