import useNote from "../useNote";
import { useMediaQuery } from '@react-hook/media-query'
import NoteLink from './NoteLink'

const styles = {
  noteContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  note: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: '140px'
  }
}


const Backlinks = () => {
  const note = useNote()
  const potrait = useMediaQuery('(max-width: 800px)')

  if (!note) return null


  const { title, backlinks, wikilinks, tags } = note


  const backlinkTitle = getBacklinkTitle(backlinks.length)

  return (
    <div id='notelistContainer'>
      <NoteTitle title={title} />
      <NoteList
        title={backlinkTitle}
        emptyMessage={'No backlinks'}
        currentNote={note}
        notes={backlinks}
      />
      <NoteList
        title='Refecenred notes'
        emptyMessage='No referenced notes'
        currentNote={note}
        notes={wikilinks}
        skipIf={potrait}
      />
      <TagList
        title='Hashtags'
        tags={tags}
      />
    </div>
  )
}

const getBacklinkTitle = (count) => {
  switch (count) {
    case 0: return 'Linked references'
    case 1: return '1 linked reference'
    default: return `${count} linked references`
  }
}

const NoteTitle = ({ title }) => {
  return (
    <h1 className='note-title'>{title || 'Unnamed'}</h1>
  )
}

const TagList = ({ tags, title }) => {
  return (
    <div>
      <h2 className='backlinksTitle'>{ title }</h2>
      <div className='backlinks' style={styles.noteContainer}>
          {tags.map(tag => (
            <div key={tag} className='tag'>
              <a href='/'> {'#' + tag}</a>
            </div>
          ))}
      </div>
    </div>
  )
}

const NoteList = ({ currentNote, title, notes, emptyMessage, skipIf }) => {

  if (skipIf === true) {
    return false
  }

  const renderTags = (tags=[]) => {
    return (
      <div className='tags'>{tags.map(tag => '#' + tag).join(' ')} </div>
    )
  }

  const renderWikilinks = (wikilinks=[]) => {

    const noteLinks = wikilinks.map(title =>
      <NoteLink title={title} />
    )

    return (
      <div className='wikilink'>
        {noteLinks}
      </div>
    )
  }

  console.log(title, { notes })

  return (
    <div>
      <h2 id='backlinksTitle'>{title}</h2>
      <div className='backlinks' style={styles.noteContainer}>
        {notes.map(({ title, tags, wikilinks}) =>
          <div key={title} className='backlink' style={styles.note}>
            <NoteLink title={title} />
            {renderTags(tags)}
            {renderWikilinks(wikilinks)}
          </div>
        )}
        {notes.length === 0 && <div>{emptyMessage}</div>}
      </div>
    </div>
  )

}

export default Backlinks