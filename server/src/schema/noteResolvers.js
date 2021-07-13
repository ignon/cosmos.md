import __ from 'lodash'
import { parseNote } from '../markdown/noteParser.js'
import Note from '../models/Note.js'
import User from '../models/User.js'
import { AuthenticationError, UserInputError } from 'apollo-server-errors'
import logger from '../utils/logger.js'
import { requireAuth } from '../middleware/middlewareCheck.js'


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
    addNote: async (_, args, ctx) => {
      requireAuth(ctx)

      const note = parseNote(args.note)
      note.userId = ctx.userId

      console.log('adding note', note.title)

      const newNote = new Note(note)

      return newNote.save()
        .then(result => result.toJSON())
    },
    addNotes: async (_, args) => {
      requireAuth(ctx)

      const notes = args

      // This creates problems IF backlinks are SAVED to MongoDB
      // This creates problems WHEN notes not yet updated are saved
      // as wikilinks (zettelID=null when not yet saved)
      // Should use some kind of data-loader
      const populatedNotes = notes.map(async (n) => await populateNote(n))
    },
    editNote: async (_, args) => {
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

      return updatedNote.toJSON()
    },
    register: async (_, args) => {
      const { username, password } = args

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        passwordHash
      })

      return user.save()
        .then(result => {
          const token = generateToken(user.toJSON())
          return { token }
        })
    },
    login: async (_, args) => {
      const { username, password } = args
      const user = await User.findOne({ username })

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)


      if (!user || !passwordCorrect) {
        throw new AuthenticationError('Invalid username or password')
      }


      if (user) {
        const token = generateToken(user)
        return { token }
      }
      // if (!user || args.password !== 'secret') {
      //   throw new UserInputError('wrong credentials')
      // }

      // const userForToken = {
      //   username: newUsername,
      //   id: user._id
      // }

      return user
    }
  }
}

export default resolvers