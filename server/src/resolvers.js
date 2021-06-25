import _ from 'lodash'
import { v1 as uuid } from 'uuid'
import { queryBacklinks } from './utils.js'
import { parseNote } from './noteParser.js'
import Note from './models/Note.js'
import { UserInputError } from 'apollo-server-errors'
// import mockNotes from './notes.js'
const notes = [] // (NODE_ENV === NODE_ENVS.DEVELOPMENT) ? mockNotes : []



const resolvers = {
  Query: {
    noteCount: () => notes.length,
    allNotes: () => {
      return Note.find({})
    },
    findNotes: (_, { tag, title, zettelId }) => {
      // const titleMatch = title ? notes.find(n => n.title === title) : null
      // const zettelIdMatch = zettelId ? notes.find(n => n.zettelId === zettelId) : null
      // const tagMatches = [] //tag ? notes.filter(note => note.tags.includes(tag)) : []
      // const backlinkMatches = [] //title ? notes.filter(note => Boolean(note.backlinks.find(n => n.title))) : []

      // const matches = [titleMatch, zettelIdMatch, ...tagMatches, ...backlinkMatches]
      //   .filter(match => Boolean(match))

      console.log(zettelId)

      const mongoQuery = { $or: [] }
      if (zettelId) mongoQuery.$or.push({ zettelId })
      if (title) mongoQuery.$or.push({ title })
      if (tag) mongoQuery.$or.push({ tags: { $in: tag } })

      console.log(mongoQuery)

      return Note.find(mongoQuery)
    },
    findNote: async (_, { query }) => {
      const zettelIdRegex = /^\d+$/ // All characters numbers
      const isValidZettelId = zettelIdRegex.test(query)

      const mongoQuery = (isValidZettelId)
        ? { $or: [{ zettelId: query }, { title: query }] }
        : { title: query }


      return Note.findOne(mongoQuery)
        .then(result => {
          console.log('RESULT', result)
          return result
        })
        .catch(error => {
          return error
        })
    },
  },
  Note: {
    backlinks: (root) => queryBacklinks(notes, root.title),
  },
  Mutation: {
    addNote: (root, args) => {
      console.log(root, args)
      const note = {
        ...parseNote(args),
        backlinks: queryBacklinks(notes, args.title)
      }

      const newNote = new Note(note)

      return newNote
        .save()
        .then(savedNote => {
          return newNote.toJSON()
        })
    },
    editNote: (root, args) => {
      const note = {
        ...parseNote(args),
        backlinks: queryBacklinks(notes, args.title)
      }

      const { zettelId } = note

      return Note.findOneAndUpdate({ zettelId }, note, { new: true })
        .then(result => {
          if (result) {
            return result
          } 
          throw new UserInputError('Note with corresponding id doesn\'t exist')
        })
      // notes[noteIndex] = note
      // return note
    },
    // clearNotes: (root, args) => {
    //   if (process.env.NODE_ENV === config.NODE_ENVS.TEST) {
    //     notes = []
    //   }
    // }
  }
}

export default resolvers