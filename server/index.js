const { v1: uuid } = require('uuid')
const { ApolloServer, gql } = require('apollo-server')
const { UniqueDirectiveNamesRule } = require('graphql')

let notes = [
  {
    title: 'ApolloServer',
    zettelId: '202106221711',
    tags: ['backend', 'node', 'graphql'],
    links: ['GraphQL', 'ApolloClient'],
    backlinks: [{ title: 'GraphQL', zettelId: '202106221713' }],
    text: 'Apollo Server is an GraphQL server compatible with any [[GraphQL]] client, including [[ApolloClient]]. #backend #node #graphql',
  },
  {
    title: 'GraphQL',
    zettelId: '202106221713',
    tags: ['backend', 'node'],
    links: ['ApolloClient'],
    backlinks: [{ title: 'GraphQL', zettelId: '202106221713' }],
    text: 'GraphQL is a query language for APIs. Used with tools like [[ApolloClient]] and [[ApolloServer]]. #backend #node'
  }
]

notes = notes.map(note => ({ ...note, id: uuid() }))
console.log(notes)

const typeDefs = gql`
  type Note {
    id: ID!
    title: String!
    zettelId: String!
    tags: [String!]!
    links: [String!]!
    backlinks: [NoteRef!]
    text: String! # Required?
  }

  type NoteRef {
    title: String
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
      zettelId: String!
      text: String!
    ): Note
  }
`

const parseNote = (args) => {
  args = notes[0]
  const { title, text, zettelId } = args

  const hashtagRegex = /#[\w_-]+/
  const wikilinkRegex = /\[\[([\w_-]+)\]]/

  console.log('text', text)
  const hashtags = text.match(hashtagRegex)
  const wikilinks = text.match(wikilinkRegex)

  console.log('HASHTAGS: ', hashtags, '\nWIKILINKS: ', wikilinks)

  return notes[0]
}

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