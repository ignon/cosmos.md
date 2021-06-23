import { gql } from 'apollo-server'

export const ALL_NOTES = gql`
  query ALL_NOTES {
    allNotes {
      title,
      zettelId
    }
  }
`

export const ADD_NOTE = gql`
  mutation addNote($title: String!, $zettelId: String, $text: String!){
    addNote(
      title: $title
      zettelId: $zettelId
      text: $text
    ) {
      title
      zettelId
      text
      tags
      wikilinks { title zettelId }
      backlinks { title zettelId }
    }
  }
`
export const CLEAR_NOTES = gql`
  mutation clearNotes {
    response
  }
`