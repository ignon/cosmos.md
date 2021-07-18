import __ from 'lodash'
import { parseNote } from '../markdown/noteParser.js'
import Note from '../models/Note.js'
import User from '../models/User.js'
import { UserInputError } from 'apollo-server-errors'
import logger from '../utils/logger.js'
import { requireAuth } from '../middleware/middlewareCheck.js'
import mongoose from 'mongoose'
import { escapeRegexSubstring, getZettelId } from '../utils/utils.js'
import { GraphQLScalarType } from 'graphql'


const updateRecentNotes = async (note) => {
  const userId = note.userId
  const noteId = note._id
  if (!noteId) return

  const recentNotes = await User.findByIdAndUpdate(userId, {
    $addToSet: { recentNotes: noteId }
  })

  const maxLength = 10

  if (recentNotes.length > maxLength) {
    User.findByIdAndUpdate(userId, {
      recentNotes: __.sortBy(recentNotes, 'modified').slice(0, maxLength)
    })
  }
}

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize: (date) => getZettelId(date),
  parseValue: (value) => new Date(value),
  parseLiteral: (ast) => ( 
    ast.kind === Kind.INT
      ? new Date(parseInt(ast.value, 10))
      : null
   ),
});

const resolvers = {
  Query: {
    allNotes: (_, args, ctx) => {
      requireAuth(ctx)

      const { userId } = ctx
      console.log('all notes ', userId )
      return Note.find({ userId })
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
    searchNotes: async (_, args, ctx) => {
      requireAuth(ctx)

      const { userId } = ctx
      const input = escapeRegexSubstring(args.input)

      if (!input) {
        const user = await User
          .findById(userId)
          .populate('recentNotes')
        
        const { recentNotes } = user
        return __.sortBy(recentNotes, 'modified')
          // .reverse()
      }

      const $regex = new RegExp(`^${input}`, 'i')

      const notes = await Note.find({
        $or: [
          { userId, title: { $regex } },
          { userId, $text: { $search: input } },
        ]
      })
        .limit(20)

      console.log({ notes })

      return notes
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

      }
      catch(error) {
        throw new UserInputError('Input error ' + error.message, { invalidArgs: true })
      }
    },
    allTags: async (_, args, ctx) => {
      requireAuth(ctx)
      const { userId } = ctx

      const tags = await Note.find({ userId }).distinct('tags')
      return tags
    }
  },
  Date: dateScalar,
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
    },
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

      console.log('EDIT', { note })

      const { title } = note

      const updatedNote = await Note.findOneAndUpdate({ title }, note, {
        upsert: true,
        new: true
      })

      updateRecentNotes(updatedNote)

      return updatedNote.toJSON()
    },
  }
}

export default resolvers

