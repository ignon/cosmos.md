import Note from '../models/Note.js'
import DataLoader from 'dataloader'


const createDataloaders = ({ userId }) => {

  const getBacklinks = async (titles) => {
    const backlinkMap = {}
    
    titles.forEach(t =>
      backlinkMap[t] = []
    )
      
    const backlinkNotes = await Note.find({
      $and: [
        { userId },
        { wikilinks: { $in: titles } }
      ]
    }).select('title wikilinks -_id')
      
    // console.log('TITLES', titles)
    // console.log('BACKLINK NOTES', backlinkNotes)
    backlinkNotes.forEach(note => {
      note.wikilinks.forEach(wikilink => {
        if (backlinkMap[wikilink]) {
          backlinkMap[wikilink].push(note.title)
        }
      })
    })

    const backlinks = titles.map(title => backlinkMap[title]) 
    return backlinks
  }


  return {
    backlinks: new DataLoader(getBacklinks)
  }
}

export default createDataloaders