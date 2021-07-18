import dateFormat from 'dateformat'


export const getZettelId = (date=new Date, sparce=true) => {
  const format = 'yyyy-mm-dd-HH-MM-ss'
  let zettelId = dateFormat(date, format)

  if (sparce) {
    return zettelId.replace(/-/g, '')
  }

  return zettelId
}

export const queryBacklinks = (notes, noteTitle) => {
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

export function escapeRegexSubstring(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}