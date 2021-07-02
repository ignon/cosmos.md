import { gql } from 'apollo-server'

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

  type NoteRef {
    title: String!
    zettelId: String
  }

  input NoteArgs {
    title: String!
    text: String!
    zettelId: String
  }

  extend type Query {
    noteCount: Int!
    allNotes: [Note!]!
    findNote(query: String!): Note
    findNotes(title: String, zettelId: String, tag: String): [Note]!
  }

  extend type Mutation {
    addNote(
      note: NoteArgs
    ): Note

    addNotes(notes: [NoteArgs]): [Note]

    editNote(note: NoteArgs): Note
  }
`

export default typeDefs