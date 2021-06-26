import _ from 'lodash'
import { queryBacklinks } from './utils.js'
import { parseNote } from './noteParser.js'
import Note from './models/Note.js'
import { UserInputError } from 'apollo-server-errors'
import mongoose from 'mongoose'
// import mockNotes from './notes.js'
const notes = [] // (NODE_ENV === NODE_ENVS.DEVELOPMENT) ? mockNotes : []



const resolvers = {
  Query: {
    noteCount: () => notes.length,
    allNotes: () => {
      return Note.find({})
    },
    findNotes: (_, { tag, title, zettelId }) => {
      const mongoQuery = { $or: [] }
      if (zettelId) mongoQuery.$or.push({ zettelId })
      if (title) mongoQuery.$or.push({ title })
      if (tag) mongoQuery.$or.push({ tags: { $in: tag } })

      if (mongoQuery.$or.length === 0) {
        return []
      }

      return Note.find(mongoQuery)
    },
    findNote: async (_, { query }) => {
      const zettelIdRegex = /^\d+$/
      const isValidZettelId = zettelIdRegex.test(query)

      const mongoQuery = (isValidZettelId)
        ? { $or: [{ zettelId: query }, { title: query }] }
        : { title: query }

      return Note.findOne(mongoQuery)
    },
  },
  Note: {
    backlinks: async ({ zettelId, title }) => {
      const backlinks = await Note.find({
        $or: [
          { zettelId },
          { $and: [ { title }, { zettelId: null }]}
        ]
      })

      return backlinks
    },
    wikilinks: ({ wikilinks }) => {
      return wikilinks ?? []
    }
  },
  Mutation: {
    addNote: (_, args) => {
      const note = parseNote(args)

      const newNote = new Note(note)
      return newNote.save()
    },
    editNote: async (_, args) => {
      const note = parseNote(args)
      const { zettelId, title } = note

      const wikilinkTitles = note.wikilinks.map(ref => ref.title)

      const wikilinks = await Note.find({
        title: {
          $in: wikilinkTitles
        }
      }).select('title zettelId -_id')

      // match: title && zettelId===null
      // zettelId === zettelId
      // How do we handle deleteNote and remove references?
      const backlinks = await Note.find({
        $or: [
          { zettelId },
          { $and: [ { title }, { zettelId: null }]}
        ]
      })

      const populatedNote = {
        ...note,
        wikilinks
      }

      const newNote = await Note.findOneAndUpdate({ zettelId }, populatedNote, { new: true })
      return newNote
    },
    // clearNotes: (root, args) => {
    //   if (process.env.NODE_ENV === config.NODE_ENVS.TEST) {
    //     notes = []
    //   }
    // }
  }
}

export default resolvers