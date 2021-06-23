import dateFormat from 'dateformat'


const getZettelId = (dateString=null) => {
  const date = (dateString)
    ? new Date(dateString)
    : new Date()

  const format = 'yyyy-mm-dd-HH-MM-ss'
  const zettelId = dateFormat(date, format).replace(/-/g, '')

  return zettelId
}

const queryBacklinks = (notes, noteTitle) => {
  const linksToNote = (note, title) => {
    const noteMentions = note.wikilinks
      .filter(noteRef => noteRef.title === noteTitle).length
    
    return (noteMentions > 0)
  }

  return notes
    .filter(n => linksToNote(n, noteTitle))
    .map(({ title }) => ({
      title,
      zettelId: null
    }))
}

export default { getZettelId, queryBacklinks }