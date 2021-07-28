import __ from 'lodash'
import { parseNote } from '../markdown/noteParser.js'
import Note from '../models/Note.js'
import User from '../models/User.js'
import { UserInputError } from 'apollo-server-errors'
import { requireAuth } from '../middleware/middlewareCheck.js'
import mongoose from 'mongoose'
import { escapeRegexSubstring } from '../utils/utils.js'
import { dateScalar } from './customScalars.js'


const sortLatestNotes = (notes) => {
  const maxLength = 10

  const sortedNotes = __.sortBy(notes, n => n.modified)
  return sortedNotes.reverse().slice(0, maxLength)
}

const updateRecentNotes = async (note, userId) => {
  const noteId = note._id
  if (!noteId) return

  console.log({ userId })

  const recentNotes = await User.findByIdAndUpdate(userId, {
    $addToSet: { recentNotes: noteId }
  })

  const maxLength = 20
  if (recentNotes.length > maxLength) {
    User.findByIdAndUpdate(userId, {
      recentNotes: sortLatestNotes(recentNotes)
    })
  }
}


const resolvers = {
  Query: {
    allNotes: (_, args, ctx) => {
      const userId = ctx.userOrDefaultId

      return Note.find({ userId })
    },
    findNote: async (_, { query, title, zettelId }, ctx) => {
      const userId = ctx.userOrDefaultId

      const zettelIdRegex = /^\d+$/
      const isValidZettelId = zettelIdRegex.test(query)

      let mongoQuery
      if (zettelId) {
        mongoQuery = { userId, zettelId }
      }
      else if (title) {
        mongoQuery = { userId, title }
      }
      else if (query) {
        mongoQuery = (isValidZettelId)
          ? { $or: [{ userId, zettelId: query }, { userId, title: query }] }
          : { userId, title: query }
      }

      return Note.findOne(mongoQuery)
    },
    searchNotes: async (_, args, ctx) => {
      const userId = ctx.userOrDefaultId
      const input = escapeRegexSubstring(args.input)

      if (!input && !ctx.userId) {
        return Note.find({ userId })
      }

      if (!input) {
        const user = await User
          .findById(userId)
          .populate('recentNotes')
        
        const { recentNotes } = user
        const sortedNotes = __.sortBy(recentNotes, n => ( 
          n.modified || Number.MIN_VALUE
        ))
          .reverse()

        return sortedNotes
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
    // findLatestNotes: async (_, args, ctx) => {
    //   requireAuth(ctx)

    //   try {
    //     const userId = mongoose.Types.ObjectId(ctx.userId)
    //     const user = await User
    //       .findById(userId)
    //       .populate('recentNotes')

    //     const { recentNotes } = user

    //   }
    //   catch(error) {
    //     throw new UserInputError('Input error ' + error.message, { invalidArgs: true })
    //   }
    // },
    allTags: async (_, args, ctx) => {
      const userId = ctx.userOrDefaultId

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
      const { userId } = ctx

      const note = parseNote(args.note)
      note.userId = userId

      console.log('adding note', note.title)

      try {
        const newNote = new Note(note)
        const savedNote = await newNote.save()

        updateRecentNotes(savedNote, userId)
        return savedNote.toJSON()
      }
      catch(error) {
        throw new UserInputError('Input error ' + error.message, { invalidArgs: true })
      }
    },
    editNote: async (_, args, ctx) => {
      requireAuth(ctx)
      const { userId } = ctx

      const note = parseNote(args.note)
      note.userId = ctx.userId

      console.log('EDIT', { note })

      const { title } = note

      const updatedNote = await Note.findOneAndUpdate({ userId, title }, note, {
        upsert: true,
        new: true
      })

      console.log({ updatedNote })
      updateRecentNotes(updatedNote, userId)

      return updatedNote
    },
  }
}

export default resolvers

