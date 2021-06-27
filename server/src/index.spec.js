import _ from 'lodash'
import schema from './schema.js'
import { ApolloServer } from 'apollo-server'
import { ALL_NOTES, ADD_NOTE } from './queries.js'
// import Note from './models/Note'
import server from './server'
import mongoose from 'mongoose'
import Note from './models/Note.js'
import { getNotesInDatabase } from './utils/test_helper.js'

/**
 * There are multiple ways to test backend:
 * 1. Test requests from front end
 * 2. Tests from back end
 * 3. Ingegration tests with front end
 */

let notes = [
  {
    title: 'ApolloServer',
    zettelId: '202106221711',
    text: '[[GraphQL]] server compatible with [[ApolloClient]]. #backend #node #graphql',
  },
  {
    title: 'GraphQL',
    zettelId: '202106221713',
    text: 'GraphQL is a query language for APIs. Used with tools like [[ApolloClient]] and [[ApolloServer]]. #backend #node'
  }
]

beforeAll(async () => {
  await Note.deleteMany({})
})


describe('ApolloServer', () => {

  describe('database is empty', () => {
    test('adding note works', async () => {
      const note = {
        title: 'ApolloClient',
        zettelId: '202106222712',
        text: '[[GraphQL]] client for [[ApolloServer]]. #backend #node #graphql',
      }

      const result = await server.executeOperation({
        query: ADD_NOTE,
        variables: note
      })

      const addedNote = result.data.addNote
      const { title, zettelId, text, tags, wikilinks, backlinks } = addedNote

      expect(title).toBe(note.title)
      expect(zettelId).toBe(note.zettelId)
      expect(text).toContain(note.text)
      expect(tags).toEqual(['backend', 'node', 'graphql'].sort())

      expect(wikilinks.map(ref => ref.title)).toEqual(['ApolloServer', 'GraphQL'])
    })
  })
})


describe('when notes exists', () => {
  beforeEach(async () => {
    await Note.deleteMany({})

    for (const note of notes) {
      const result = await server.executeOperation({
        query: ADD_NOTE,
        variables: note
      })

      expect(result.data.addNote).toBeTruthy()
    }
  })

  test('getting notes works', async () => {
    const { data } = await server.executeOperation({
      query: ALL_NOTES
    })
    
    expect(data.allNotes).toBeInstanceOf(Array)
    expect(data.allNotes).toHaveLength(notes.length)
  })

  test('test', () => {
    expect(true).toBe(true)
  })

  test('adding note works', async () => {
    const note = {
      title: 'ApolloClient',
      zettelId: '202106222712',
      text: '[[GraphQL]] client for [[ApolloServer]]. #backend #node #graphql',
    }

    const all = await getNotesInDatabase()
    const allTitles = _.map(all, 'wikilinks')
    console.log('Notes in database:', allTitles)

    const result = await server.executeOperation({
      query: ADD_NOTE,
      variables: note
    })

    const addedNote = result.data.addNote
    const { title, zettelId, text, tags, wikilinks, backlinks } = addedNote

    // console.log((JSON.stringify(addedNote, null, 4)))

    expect(title).toBe(note.title)
    expect(zettelId).toBe(note.zettelId)
    expect(text).toContain(note.text)
    expect(tags).toEqual(['backend', 'node', 'graphql'].sort())

    expect(wikilinks.map(ref => ref.title)).toEqual(['ApolloServer', 'GraphQL'])
    expect(_.find(wikilinks, { zettelId: null })).toBeFalsy()
    // expect(backlinks.map(ref => ref.title)).toEqual(['ApolloServer', 'GraphQL'])
    // expect(backlinks.find(ref => (!ref.zettelId))).toBeFalsy()
  })
})


afterAll(() => {
  mongoose.connection.close()
})