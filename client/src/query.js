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

export const SEARCH_NOTES = gql`
  query SearchNotes($input: String!) {
    searchNotes(input: $input) {
      title
      zettelId
      modified
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