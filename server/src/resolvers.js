import __ from 'lodash'
import { queryBacklinks } from './utils.js'
import { parseNote } from './noteParser.js'
import Note from './models/Note.js'
import { UserInputError } from 'apollo-server-errors'
import logger from './utils/logger.js'

const notes = [] // (NODE_ENV === NODE_ENVS.DEVELOPMENT) ? mockNotes : []

// Queried from apollo context later...
const userId = 'arde'

const combineWikilinks = (parsedWikilinks, wikilinksInDb) => ( 
  Object.values(
    __.keyBy([ ...parsedWikilinks, ...wikilinksInDb ], 'title')
  )
)

const getWikilinksInDatabse = async (wikilinkTitles) => {
  const wikilinks = await Note.find({
    title: {
      $in: wikilinkTitles
    }
  }).select('title zettelId -_id')

  return wikilinks
}


const populateNote = async (note) => {
  const { zettelId, title } = note

  const wikilinkTitles = note.wikilinks.map(ref => ref.title)
  const wikilinksInDb = await getWikilinksInDatabse(wikilinkTitles)
  const wikilinks = combineWikilinks(note.wikilinks, wikilinksInDb)

  const populatedNote = {
    ...note,
    wikilinks
  }

  return populatedNote
}


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
    backlinks: ({ zettelId, title }) => {
      return Note.find({
        $or: [
          { 'wikilinks.zettelId': zettelId },
          { wikilinks: { title, zettelId: null } }
        ]
      }).select('title zettelId -_id')
    },
    wikilinks: ({ wikilinks }) => {
      return wikilinks ?? []
    }
  },
  Mutation: {
    addNote: async (_, args) => {
      console.log(args)
      const note = parseNote(args.note)
      const populatedNote = await populateNote(note)

      // User received from apollo contect
      populatedNote.userId = userId

      const newNote = new Note(populatedNote)

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
      const populatedNote = await populateNote(note)

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