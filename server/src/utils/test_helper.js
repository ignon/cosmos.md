import Note from '../models/Note'

export const getNotesInDatabase = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}