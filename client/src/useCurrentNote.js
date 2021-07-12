import { zettelIdVar } from './cache'
import { useQuery, useReactiveVar } from '@apollo/client'
import { FIND_NOTE } from './query'

export const useCurrentNote = ({ onCompleted } = {}) => {
  const zettelId = useReactiveVar(zettelIdVar)

  const { data } = useQuery(FIND_NOTE, {
    fetchPolicy: 'network-only',
    variables: { query: zettelId },
    onCompleted: (data) => {
      const note = data?.findNote
      console.log('onCompleted', { note })
      onCompleted(note)
    }
  })

  const note = data?.findNote
  console.log({ note, zettelId })
  return note
}