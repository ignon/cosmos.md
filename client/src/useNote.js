import { zettelIdVar } from './cache'
import { useQuery, useReactiveVar } from '@apollo/client'
import { FIND_NOTE } from './query'

const useNote = ({ onChange, fetchPolicy='cache-only' } = {}) => {
  const zettelId = useReactiveVar(zettelIdVar)

  const result = useQuery(FIND_NOTE, {
    fetchPolicy,
    variables: { zettelId },
    onCompleted: ({ findNote: note } = {}) => {
      if (note) onChange?.(note)
    }
  })

  const note = result.data?.findNote
  return note
}

export default useNote


// const client = useApolloClient()
// const zettelId = zettelIdVar()
// const note2 = client.readFragment({
//   id: `Note:${zettelId}`,
//   fragment: gql`fragment MyNote on Note { zettelId, text }`
// })
// console.log({ note2 })

// useEffect(() => { }, [note, editor])