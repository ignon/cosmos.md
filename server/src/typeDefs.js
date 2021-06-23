// https://www.apollographql.com/blog/backend/schema-design/modularizing-your-graphql-schema-code/

const { gql } = require('apollo-server')

const typeDefs = gql`
  type Note {
    id: ID!
    title: String!
    zettelId: String!
    tags: [String!]!
    wikilinks: [NoteRef]!
    backlinks: [NoteRef]!
    text: String! # Required?
  }

  type NoteRef {
    title: String!
    zettelId: String
  }

  type Query {
    noteCount: Int!
    allNotes: [Note!]!
    findNote(query: String!): Note
    findNotes(title: String, zettelId: String, tag: String): [Note]!
  }

  type Mutation {
    addNote(
      title: String!
      text: String!
      zettelId: String
    ): Note

    editNote(
      title: String!
      zettelId: String
      text: String!
    ): Note
  }
`

module.exports = typeDefs