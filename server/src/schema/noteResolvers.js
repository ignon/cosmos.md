import __ from 'lodash'
import { parseNote } from '../markdown/noteParser.js'
import Note from '../models/Note.js'
import User from '../models/User.js'
import { AuthenticationError, UserInputError } from 'apollo-server-errors'
import logger from '../utils/logger.js'
import { requireAuth } from '../middleware/middlewareCheck.js'
import mongoose from 'mongoose'
import { GraphQLError } from 'graphql'


const updateRecentNotes = async (note) => {
  const result = await User.findByIdAndUpdate(note.userId, {
    $pull: { 
      recentNotes: {
        $in: [ note._id ]
      },
    },
  })
  const result2 = await User.findByIdAndUpdate(note.userId, {
    $push: {
      recentNotes: {
        $each: [note._id],
        $position: 0,
        $slice: 10
      }
    }
  })
  console.log({ result, result2 })
}

const resolvers = {
  Query: {
    allNotes: (_, args, ctx) => {
      requireAuth(ctx)

      const { userId } = ctx
      console.log('all notes ', userId )
      return Note.find({ userId })
    },
    findNotes: (_, { tag, title, zettelId }, ctx) => {
      requireAuth(ctx)

      const mongoQuery = { $or: [] }
      if (zettelId) mongoQuery.$or.push({ zettelId })
      if (title) mongoQuery.$or.push({ title })
      if (tag) mongoQuery.$or.push({ tags: { $in: tag } })

      if (mongoQuery.$or.length === 0) {
        return []
      }

      return Note.find(mongoQuery)
    },
    findNote: async (_, { query, title, zettelId }, ctx) => {
      console.log(ctx)
      requireAuth(ctx)

      const zettelIdRegex = /^\d+$/
      const isValidZettelId = zettelIdRegex.test(query)

      let mongoQuery
      if (zettelId) {
        mongoQuery = { zettelId }
      }
      else if (title) {
        mongoQuery = { title }
      }
      else if (query) {
        mongoQuery = (isValidZettelId)
          ? { $or: [{ zettelId: query }, { title: query }] }
          : { title: query }
      }


      return Note.findOne(mongoQuery)
    },
    findLatestNotes: async (_, args, ctx) => {
      console.log(ctx)
      requireAuth(ctx)

      try {
        const userId = mongoose.Types.ObjectId(ctx.userId)
        const user = await User
          .findById(userId)
          .populate('recentNotes')

        const { recentNotes } = user

        return recentNotes
      }
      catch(error) {
        throw new UserInputError('Input error ' + error.message, { invalidArgs: true })
      }
    }
  },
  Note: {
    backlinks: async ({ title }, args, context) => {
      const { backlinks } = context.loaders
      return await backlinks.load(title)
    },
    wikilinks: ({ wikilinks }) => {
      return wikilinks ?? []
    },
    userId: ({ userId }) => {
      if (typeof userId === 'string') {
        return mongoose.Types.ObjectId(userId)
      }
      return userId
    }
  },
  Mutation: {
    addNote: async (_, args, ctx) => {
      requireAuth(ctx)

      const note = parseNote(args.note)
      note.userId = ctx.userId

      console.log('adding note', note.title)

      try {
        const newNote = new Note(note)
        const savedNote = await newNote.save()

        updateRecentNotes(savedNote)

        return savedNote.toJSON()
      }
      catch(error) {
        throw new UserInputError('Input error ' + error.message, { invalidArgs: true })
      }
    },
    addNotes: async (_, args, ctx) => {
      requireAuth(ctx)

      const notes = args

      // This creates problems IF backlinks are SAVED to MongoDB
      // This creates problems WHEN notes not yet updated are saved
      // as wikilinks (zettelID=null when not yet saved)
      // Should use some kind of data-loader
      const populatedNotes = notes.map(async (n) => await populateNote(n))
    },
    editNote: async (_, args, ctx) => {
      requireAuth(ctx)

      const note = parseNote(args.note)
      note.userId = ctx.userId

      const { zettelId, title } = note

      const oldNote = await Note.findOne({ zettelId })
      if (!oldNote) {
        throw new Error(`Note with zettelId ${zettelId} doesn't exist`)
      }

      if (oldNote.title !== title) {
        logger.info('Updating notes which have wikilink to this note')
      }

      const updatedNote = await Note.findOneAndUpdate({ zettelId }, note, { new: true })

      if (!updatedNote) {
        throw new UserInputError(`Note with zettelId: '${zettelId}' doesn't exist`)
      }

      updateRecentNotes(updatedNote)

      return updatedNote.toJSON()
    },
  }
}

export default resolvers