import { useRouteMatch } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { FIND_NOTE } from './query'
import { getZettelId } from './utils'

const useNote = ({ onChange, fetchPolicy='network-only' } = {}) => {
  const noteQueryMatch = useRouteMatch('/:query')
  const queryRaw = noteQueryMatch?.params.query || 'ApolloServer'
  const query = queryRaw.replaceAll('+', ' ')


  console.log({ query })


  const result = useQuery(FIND_NOTE, {
    skip: Boolean(!query),
    query: query,
    fetchPolicy,
    variables: { query },
    onCompleted: ({ findNote } = {}) => {
      const noteFound = (findNote)
      const note = (noteFound)
        ? findNote
        : createNewNote(query)
      
      onChange?.(note)
    }
  })

  const { data, loading, error } = result

  const note = data?.findNote

  if (!note && !loading && !error) {
    const note = createNewNote(query)
    return note
  }


  return note
}

export default useNote

const createNewNote = (title) => {
    return {
      title,
      text: `# ${title}\n\n`,
      zettelId: getZettelId(),
      backlinks: [],
      wikilinks: [],
      tags: []
    }
}