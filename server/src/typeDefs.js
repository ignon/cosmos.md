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
    wikilinks: [NoteRef]!
    backlinks: [NoteRef]!
    text: String! # Required?
    userId: String
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
  }
`

export default typeDefs