const { v1: uuid } = require('uuid')
const { ApolloServer, gql } = require('apollo-server')
const { UniqueDirectiveNamesRule } = require('graphql')
const { parseNote } = require('./noteParser')

let notes = [
  {
    title: 'ApolloServer',
    zettelId: '202106221711',
    // tags: ['backend', 'node', 'graphql'],
    // wikilinks: ['GraphQL', 'ApolloClient'],
    // backlinks: [{ title: 'GraphQL', zettelId: '202106221713' }],
    text: 'Apollo Server is an GraphQL server compatible with any [[GraphQL]] client, including [[ApolloClient]]. #backend #node #graphql',
  },
  {
    title: 'GraphQL',
    zettelId: '202106221713',
    // tags: ['backend', 'node'],
    // wikilinks: ['ApolloClient'],
    // backlinks: [{ title: 'GraphQL', zettelId: '202106221713' }],
    text: 'GraphQL is a query language for APIs. Used with tools like [[ApolloClient]] and [[ApolloServer]]. #backend #node'
  }
]

notes = notes
  .map(note => parseNote(note))
  .map(note => ({ ...note, id: uuid() }))

console.log('notes 1', JSON.stringify(notes, null, 4))

notes = notes.map(note => {
  const { title } = note

  return {
    ...note,
    backlinks: notes
      .filter(
        n => n.wikilinks.map(({ title }).includes(title)
      ))
      
  }
})

console.log('notes 2', JSON.stringify(notes, null, 4))

const typeDefs = gql`
  type Note {
    id: ID!
    title: String!
    zettelId: String!
    tags: [String!]!
    wikilinks: [String!]!
    backlinks: [NoteRef!]
    text: String! # Required?
  }

  type NoteRef {
    title: String!
    zettelId: String
  }

  type Query {
    noteCount: Int!
    allNotes: [Note!]!
    findNote(title: String!): Note
  }

  type Mutation {
    addNote(
      title: String!
      zettelId: String
      text: String!
    ): Note
  }
`

const resolvers = {
  Query: {
    noteCount: () => notes.length,
    allNotes: () => notes,
    findNote: (root, args) => notes.find(n => n.title === args.title),
  },
  Mutation: {
    addNote: (root, args) => {
      // console.log(args)
      const note = parseNote(args)
      return note
    }
  }
}


const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})