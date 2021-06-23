const { v1: uuid } = require('uuid')
const { parseNote } = require('./noteParser')
const { queryBacklinks } = require('./utils')


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
].map(note => parseNote(note))
 .map(note => ({ ...note, _id: uuid() }))
 

notes = notes.map(note => ({
  ...note,
  backlinks: queryBacklinks(notes, note.title)
}))


// console.log('notes', JSON.stringify(notes, null, 4))

module.exports = notes