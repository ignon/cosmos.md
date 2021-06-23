const { gql } = require('apollo-server')

const ALL_NOTES = gql`
  query ALL_NOTES {
    allNotes {
      title,
      zettelId
    }
  }
`

const ADD_NOTE = gql`
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

module.exports = {
  ALL_NOTES,
  ADD_NOTE
}