import { gql } from '@apollo/client'

export const ALL_NOTES = gql`
  query ALL_NOTES {
    allNotes {
      title
      zettelId
      tags
    }
  }
`

export const LATEST_NOTES = gql`
  query latestNotes {
    findLatestNotes {
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
      wikilinks
      backlinks
    }
  }
`

export const EDIT_NOTE_STRING = `
  mutation editNote($note: NoteArgs){
    editNote(note: $note) {
      title
      zettelId
      tags
      text
      userId
      wikilinks
    }
  }
`

export const EDIT_NOTE = gql`${
  EDIT_NOTE_STRING
}`

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

export const REGISTER = gql`
  mutation register($username: String!, $password: String!){
    register(username: $username, password: $password) {
      token
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password) {
      token
    }
  }
`

export const CLEAR_NOTES = gql`
  mutation clearNotes {
    response
  }
`

export const ALL_TAGS = gql`
  query allTags {
    allTags
  }
`