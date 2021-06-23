const _ = require('lodash')
const { v1: uuid } = require('uuid')
const { queryBacklinks } = require('./utils')
const { parseNote } = require('./noteParser')
const { NODE_ENV, NODE_ENVS } = require('./config')
const mockNotes = require('./notes')
const notes = [] // (NODE_ENV === NODE_ENVS.DEVELOPMENT) ? mockNotes : []

console.log('Notes: ', notes)
console.log('NODE_ENV: ', NODE_ENV)


const resolvers = {
  Query: {
    noteCount: () => notes.length,
    allNotes: () => notes,
    findNotes: (root, args) => {
      const { tag, title, zettelId } = args

      const titleMatch = title ? notes.find(n => n.title === title) : null
      console.log('notelist', notes)
      const zettelIdMatch = zettelId ? notes.find(n => n.zettelId === zettelId) : null
      const tagMatches = [] //tag ? notes.filter(note => note.tags.includes(tag)) : []
      const backlinkMatches = [] //title ? notes.filter(note => Boolean(note.backlinks.find(n => n.title))) : []

      const matches = [titleMatch, zettelIdMatch, ...tagMatches, ...backlinkMatches]
        .filter(match => Boolean(match))

      return _.uniq(matches)
    },
    findNote: (root, args) => {
      const { title, zettelId, query } = args

      if (query) {
        const titleRegex = /^[\w+-\.]+$/ // Needs a revisit, acceptable title chars
        const zettelIdRegex = /^\d+$/ // All characters numbers

        if (query.match(zettelIdRegex)) {
          const note = notes.find(n => n.zettelId === query)
          if (note) {
            return note
          }
        }

        if (query.match(titleRegex)) {
          return notes.find(n => n.title?.toLowerCase() === query.toLowerCase())
        }

        return null
      }
    },
  },
  Note: {
    backlinks: (root) => queryBacklinks(notes, root.title),
  },
  Mutation: {
    addNote: (root, args) => {
      console.log(root, args)
      const note = {
        _id: uuid(),
        ...parseNote(args),
        backlinks: queryBacklinks(notes, args.title)
      }

      if (notes.find(n => n.zettelId === note.zettelId)) {
        throw new Error('Zettel Id must be unique')
      }

      notes.push(note)
      return note
    },
    editNote: (root, args) => {
      const note = {
        ...parseNote(args),
        backlinks: queryBacklinks(args.title)
      }

      const noteIndex = notes.findIndex(n => n.zettelId === note.zettelId)
      if (!noteIndex) {
        throw new Error('No note with corresponding zettelId exists, failed to update')
      }

      notes[noteIndex] = note

      return note
    }
  }
}

module.exports = resolvers