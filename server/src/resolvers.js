import __ from 'lodash'
import { queryBacklinks } from './utils.js'
import { parseNote } from './noteParser.js'
import Note from './models/Note.js'
import { UserInputError } from 'apollo-server-errors'
import logger from './utils/logger.js'
// import DataLoader = require('dataloader')

const userId = 'arde'
// FIX NOTECOUNT

const resolvers = {
  Query: {
    // noteCount: () => Notes.document.length
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
    backlinks: async ({ title }, args, context) => {
      const { backlinks } = context.loaders
      return await backlinks.load(title)
    },
    wikilinks: ({ wikilinks }) => {
      return wikilinks ?? []
    }
  },
  Mutation: {
    addNote: async (_, args) => {
      const note = parseNote(args.note)
      note.userId = userId

      console.log('adding note', note.title)

      const newNote = new Note(note)

      return newNote.save()
        .then(result => result.toJSON())
    },
    addNotes: async (_, args) => {
      const notes = args

      // This creates problems IF backlinks are SAVED to MongoDB
      // This creates problems WHEN notes not yet updated are saved
      // as wikilinks (zettelID=null when not yet saved)
      // Should use some kind of data-loader
      const populatedNotes = notes.map(async (n) => await populateNote(n))
    },
    editNote: async (_, args) => {
      console.log(args)
      const note = parseNote(args.note)
      const populatedNote = note //await populateNote(note)

      // User received from apollo contect
      populatedNote.userId = userId

      const { zettelId, title } = populatedNote

      const oldNote = await Note.findOne({ zettelId })
      if (!oldNote) {
        throw new Error(`Note with zettelId ${zettelId} doesn't exist`)
      }

      if (oldNote.title !== title) {
        logger.info('Updating notes which have wikilink to this note')
        // wikilinks.forEach(() => update())
      }

      const updatedNote = await Note.findOneAndUpdate({ zettelId }, populatedNote, { new: true })

      if (!updatedNote) {
        throw new UserInputError(`Note with zettelId: '${zettelId}' doesn't exist`)
      }

      return updatedNote.toJSON()
    }
  }
}

export default resolvers