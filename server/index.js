const { v1: uuid } = require('uuid')
const { ApolloServer, gql } = require('apollo-server')
const { UniqueDirectiveNamesRule } = require('graphql')
const { parseNote } = require('./noteParser')
const _ = require('lodash')

let notes = [
  {
    title: 'ApolloServer',
    zettelId: '202106221711',
    text: 'Apollo Server is an GraphQL server compatible with any [[GraphQL]] client, including [[ApolloClient]]. #backend #node #graphql',
  },
  {
    title: 'GraphQL',
    zettelId: '202106221713',
    text: 'GraphQL is a query language for APIs. Used with tools like [[ApolloClient]] and [[ApolloServer]]. #backend #node'
  }
]

notes = notes
  .map(note => parseNote(note))
  .map(note => ({ ...note, id: uuid() }))


const queryBacklinks = (noteTitle) => {
  const linksToNote = (note, title) => {
    const noteMentions = note.wikilinks
      .filter(noteRef => noteRef.title === noteTitle).length
    
    return (noteMentions > 0)
  }

  return notes
    .filter(n => linksToNote(n, noteTitle))
    .map(({ title }) => ({
      title,
      zettelId: null
    }))
}



notes = notes.map(note => {
  return {
    ...note,
    backlinks: queryBacklinks(note.title)
  }
})

console.log('notes', JSON.stringify(notes, null, 4))

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
      zettelId: String!
      text: String!
    ): Note
  }
`

const resolvers = {
  Query: {
    noteCount: () => notes.length,
    allNotes: () => notes,
    findNotes: (root, args) => {
      const { tag, title, zettelId } = args

      const titleMatch = title ? notes.find(n => n.title === title) : null
      const zettelIdMatch = zettelId ? notes.find(n => n.zettelId === zettelId) : null
      const tagMatches = tag ? notes.filter(note => note.tags.includes(tag)) : []
      const backlinkMatches = title ? notes.filter(note => Boolean(note.backlinks.find(n => n.title))) : []

      const matches = [titleMatch, zettelIdMatch, ...tagMatches, ...backlinkMatches]
        .filter(match => Boolean(match))

      return _.uniq(matches)
    },
    findNote: (root, args) => {
      const { title, zettelId, query } = args

      if (query) {
        const titleRegex = /^[\w+-\.]+$/
        const zettelIdRegex = /^\d+$/

        if (query.match(zettelIdRegex)) {
          const note = notes.find(n => n.zettelId === query)
          if (note) {
            return note
          }
        }

        if (query.match(titleRegex)) {
          return notes.find(n => n.title === query)
        }

        return null
      }
    }
  },
  Note: {
    backlinks: (root) => queryBacklinks(root.title),
  },
  Mutation: {
    addNote: (root, args) => {
      const note = {
        ...parseNote(args),
        backlinks: queryBacklinks(root.title)
      }

      notes.concat(note)
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