// https://www.apollographql.com/blog/backend/schema-design/modularizing-your-graphql-schema-code/

import { gql } from 'apollo-server'

const noteArgs = `
`

const typeDefs = gql`
  type Note {
    id: ID!
    title: String!
    zettelId: String!
    tags: [String!]!
    wikilinks: [String]!
    backlinks: [String]!
    text: String!
    userId: String
  }

  type Token {
    token: String!
  }

  type NoteRef {
    title: String!
    zettelId: String
  }

  input NoteArgs {
    title: String!
    text: String!
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
      note: NoteArgs
    ): Note

    addNotes(notes: [NoteArgs]): [Note]

    editNote(note: NoteArgs): Note

    register(
      username: String!
      password: String!
    ): Token

    login(
      username: String!
      password: String!
    ): Token
  }
`

export default typeDefs