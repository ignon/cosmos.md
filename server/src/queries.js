const { gql } = require('apollo-server')

const ALL_NOTES = gql`
  query ALL_NOTES {
    allNotes {
      title,
      zettelId
    }
  }
`

module.exports = {
  ALL_NOTES
}