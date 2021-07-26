import { useRouteMatch } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { getZettelId } from './utils/utils'


export const FIND_NOTE = gql`
  query findNote($query: String, $title: String, $zettelId: String) {
    findNote(query: $query, title: $title, zettelId: $zettelId) {
      title
      zettelId
      text
      tags
      wikilinks
      backlinks {
        title
        tags
        wikilinks
        zettelId
      }
    }
  }
`

// export const useFindNote = () => {
//  const result = useQuery(FIND_NOTE, {
//    skip,
//    query,
//  })
// }

const useNote = ({ onChange, fetchPolicy='network-only' } = {}) => {
  const noteQueryMatch = useRouteMatch('/:query')
  const queryRaw = noteQueryMatch?.params.query || 'cosmos'
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