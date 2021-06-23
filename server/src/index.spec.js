const _ = require('lodash')
const schema = require('./schema')
const { ApolloServer } = require('apollo-server')
const { ALL_NOTES, ADD_NOTE } = require('./queries')
// const notes = require('./notes')

/**
 * There are multiple ways to test backend:
 * 1. Test requests from front end
 * 2. Tests from back end
 * 3. Ingegration tests with front end
 */

let server;

describe('ApolloServer', () => {
  beforeEach(() => {
    server = new ApolloServer({ schema, debug: true })
  })

  test('adding note works', async () => {
    const note = {
      title: 'ApolloClient',
      zettelId: '202106222712',
      text: 'Apollo Client is an GraphQL client compatible with any [[GraphQL]] server, including [[ApolloServer]]. #backend #node #graphql',
    }

    const result = await server.executeOperation({
      query: ADD_NOTE,
      variables: note
    })

    console.log(result)

    const addedNote = result.data.addNote
    const { title, zettelId, text, tags, wikilinks, backlinks } = addedNote

    console.log('received note', JSON.stringify(addedNote, null, 4))

    expect(title).toBe(note.title)
    expect(zettelId).toBe(note.zettelId)
    expect(text).toContain(note.text)
    expect(tags).toEqual(['backend', 'node', 'graphql'].sort())

    expect(wikilinks.map(ref => ref.title)).toEqual(['ApolloServer', 'GraphQL'])
    expect(wikilinks.find(ref => (!ref.zettelId))).toBeFalsy()

    expect(backlinks.map(ref => ref.title)).toEqual(['ApolloServer', 'GraphQL'])
    expect(backlinks.find(ref => (!ref.zettelId))).toBeFalsy()
  })

  // test('getting notes works', async () => {
    
  //   const { data } = await server.executeOperation({
  //     query: ALL_NOTES
  //   })
    
  //   expect(data.allNotes).toBeInstanceOf(Array)
  //   expect(data.allNotes.length).toBeGreaterThanOrEqual(2)
  // })
})

