import { gql } from 'apollo-server'

export const ALL_NOTES = gql`
  query ALL_NOTES {
    allNotes {
      title
      zettelId
      tags
    }
  }
`

export const ADD_NOTE = gql`
  mutation addNote($note: NoteArgs){
    addNote(note: $note) {
      title
      zettelId
      text
      tags
      wikilinks # { title zettelId }
      backlinks # { title zettelId }
    }
  }
`
export const CLEAR_NOTES = gql`
  mutation clearNotes {
    response
  }
`