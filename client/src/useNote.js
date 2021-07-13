import { zettelIdVar } from './cache'
import { useQuery, useReactiveVar } from '@apollo/client'
import { FIND_NOTE } from './query'

const useNote = ({ onChange, fetchPolicy='cache-only' } = {}) => {
  const zettelId = useReactiveVar(zettelIdVar)

  const result = useQuery(FIND_NOTE, {
    fetchPolicy,
    variables: { zettelId },
    onCompleted: (data) => {
      const note = data?.findNote
      onChange?.(note)
    }
  })

  const note = result.data?.findNote
  return note
}

export default useNote