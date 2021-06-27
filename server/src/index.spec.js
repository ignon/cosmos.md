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

  test('wikilinks get parsed on save, wikilinks are populated from DB and unexistent wikilinks get zettelID: null', async () => {
    const note = {
      title: 'ApolloClient',
      zettelId: '202106222712',
      text: '[[NonExistentNote]]  [[GraphQL]] [[ApolloServer]]',
    }

    const result = await server.executeOperation({
      query: ADD_NOTE,
      variables: note
    })

    const addedNote = result.data.addNote
    const { title, zettelId, text, tags, wikilinks, backlinks } = addedNote

    expect(title).toBe(note.title)
    expect(zettelId).toBe(note.zettelId)

    const wikilinkTitles = wikilinks.map(w => w.title)
    expect(wikilinkTitles).toEqual(['ApolloServer', 'GraphQL', 'NonExistentNote'])

    const nonExistentNote = wikilinks.find(w => w.title === 'NonExistentNote')
    expect(nonExistentNote.zettelId).toBe(null)

    expect(wikilinks).toEqual([
      ...notes.map(({ title, zettelId }) => ({ title, zettelId })),
      { title: 'NonExistentNote', zettelId: null }
    ])

    const notesInDatabase = await getNotesInDatabase()
    const notesThatHaveWikilinkToOurNote = notesInDatabase
      .filter(
        note => (note.wikilinks.find(w => w.title === 'ApolloClient'))
      )
      .map(({ title, zettelId }) => ({ title, zettelId }))

    expect(backlinks).toEqual(notesThatHaveWikilinkToOurNote)


    const backlinkTitles = backlinks.map(ref => ref.title)
    expect(backlinkTitles).toEqual(['ApolloServer', 'GraphQL'])


  })
})


afterAll(() => {
  mongoose.connection.close()
})