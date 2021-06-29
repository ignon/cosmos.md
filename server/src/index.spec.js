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

const notes = [
  {
    title: 'ApolloServer',
    zettelId: '202106221711',
    text: '[[GraphQL]] server compatible with [[ApolloClient]]. #backend #node #graphql',
  },
  {
    title: 'GraphQL',
    zettelId: '202106221713',
    text: 'GraphQL is a query language for APIs. Used with tools like [[ApolloClient]] and [[ApolloServer]]. #backend #node'
  },
  {
    title: 'Redis',
    zettelId: '202106221715',
    text: '[[JWT]] #gottagofast'
  }
]


const serverExecute = async (query, variables=null) => {
  return await server.executeOperation({
    query,
    variables
  })
}


describe('database is empty', () => {

  beforeAll(async () => {
    await Note.deleteMany({})
  })

  test('adding note works', async () => {
    const note = {
      title: 'ApolloClientTest',
      zettelId: '202106222712',
      text: '[[GraphQL]] client for [[ApolloServer]]. #backend #node #graphql',
    }

    const result = await serverExecute(ADD_NOTE, { note })

    const addedNote = result.data.addNote
    const { title, zettelId, text, tags, wikilinks } = addedNote

    expect(title).toBe(note.title)
    expect(zettelId).toBe(note.zettelId)
    expect(text).toContain(note.text)
    expect(tags).toEqual(['backend', 'node', 'graphql'].sort())
    expect(wikilinks).toEqual(['ApolloServer', 'GraphQL'])
  })
})


describe('when notes exists', () => {
  beforeAll(async () => {
    await Note.deleteMany({})

    for (const note of notes) {
      const result = await serverExecute(ADD_NOTE, { note })
      expect(result.data.addNote).toBeTruthy()
    }
  })

  test('getting notes works', async () => {
    const { data } = await serverExecute(ALL_NOTES)
    expect(data.allNotes).toBeInstanceOf(Array)
    expect(data.allNotes).toHaveLength(notes.length)
  })

  describe('note creation, wikilinks and backlinks get created', () => {
    let addedNote; 
    const note = {
      title: 'ApolloClient',
      zettelId: '202106222712',
      text: '[[NonExistentNote]]  [[GraphQL]] [[ApolloServer]]',
    }

    beforeAll(async () => {
      const result = await serverExecute(ADD_NOTE, { note })
      addedNote = result.data.addNote
    })

    test('basic stuff', () => {
      const { title, zettelId } = addedNote

      expect(title).toBe(note.title)
      expect(zettelId).toBe(note.zettelId)
    })


    test('wikilinks work', async () => {
      const { wikilinks } = addedNote
      expect(wikilinks).toEqual(['ApolloServer', 'GraphQL', 'NonExistentNote'])
    })

    test('backlinks work', async () => {
      const { backlinks } = addedNote

      const notesInDatabase = await getNotesInDatabase()
      const notesThatHaveWikilinkToOurNote = notesInDatabase
        .filter(note => note.wikilinks.includes('ApolloClient'))
        .map(({ title }) =>  title)

      expect(backlinks).toEqual(notesThatHaveWikilinkToOurNote)
      expect(backlinks).toEqual(['ApolloServer', 'GraphQL'])
    })
  })
})

describe('deletion works', () => {
  beforeAll(async () => {
    await Note.deleteMany({})
  })

  test('deleting duplicate notes fails', async () => {
    const note = {
      title: 'ApolloClient',
      zettelId: '202106222712',
      text: '[[NonExistentNote]]  [[GraphQL]] [[ApolloServer]]',
    }

    const result = await serverExecute(ADD_NOTE, { note })
    expect(result.data.addNote.title).toBe('ApolloClient')

    const result2 = await serverExecute(ADD_NOTE, { note })
    expect(result2.errors[0].message).toContain('duplicate key')
  })
})


afterAll(() => {
  mongoose.connection.close()
})