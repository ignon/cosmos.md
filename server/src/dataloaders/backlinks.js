import Note from '../models/Note.js'
import DataLoader from 'dataloader'

const backlinks = new DataLoader(async (titles) => {

  const backlinkMap = {}
  
  titles.forEach(t =>
    backlinkMap[t] = []
  )
    
  const backlinkNotes = await Note.find({
    $and: [
      { userId: 'arde' },
      { wikilinks: { $in: titles } }
    ]
  }).select('title wikilinks hashtags -_id')
    

  backlinkNotes.forEach(note => {
    note.wikilinks.forEach(wikilink => {
      if (backlinkMap[wikilink]) {
        backlinkMap[wikilink].push(note)
      }
    })
  })

  const backlinks = titles.map(note => {
    const { title, hashtags } = note
    backlinkMap[title] = { title, hashtags }
  }) 
  return backlinks
})

export default backlinks