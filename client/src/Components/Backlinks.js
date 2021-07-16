import useNote from "../useNote";
import { useMediaQuery } from '@react-hook/media-query'
import NoteLink from './NoteLink'

const Backlinks = () => {
  const note = useNote()
  const potrait = useMediaQuery('(max-width: 800px)')

  if (!note) return null


  const { backlinks, wikilinks, tags } = note

  const getBacklinkTitle = (count) => {
    switch (count) {
      case 0: return 'Linked references'
      case 1: return '1 linked reference'
      default: return `${count} linked references`
    }
  }

  const backlinkTitle = getBacklinkTitle(backlinks.length)

  return (
    <div id='notelistContainer'>
      <NoteTitle title={note.title} />
      <NoteList
        title={backlinkTitle}
        currentNote={note}
        notes={backlinks}
        emptyMessage={'No backlinks'}
      />
      <NoteList
        title='Refecenred notes'
        currentNote={note}
        notes={wikilinks}
        emptyMessage='No referenced notes'
      />
      {!potrait && (
        <div>
          <h2 id='backlinksTitle'>References notes</h2>
          <div className='backlinks'>
            <div>
              {wikilinks.map(title =>
                <div key={title} className='backlink'>
                  <NoteLink title={title} />
                </div>
              )}
            </div>
            {wikilinks.length === 0 && <div>No referenced notes</div>}
          </div>
          <h2 className='backlinksTitle'>Hashtags</h2>
          <div className='backlinks'>
              {tags.map(tag => (
                <div key={tag} className='tag'>
                  <a href='/'> {'#' + tag}</a>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

const NoteTitle = ({ title }) => {
  return (
    <h1 className='note-title'>{title || 'Unnamed'}</h1>
  )
}

const NoteList = ({ currentNote, title, notes, emptyMessage, renderIf }) => {

  if ((renderIf)  && !renderIf()) {
    return null
  }

  const renderTags = (tags=[]) => {
    return (
      <div className='tags'>{tags.map(tag => '#' + tag).join(' ')} </div>
    )
  }

  const renderWikilinks = (wikilinks=[]) => {
    return (
      <div className='wikilink'>- {wikilinks
        .filter(title => title !== currentNote.title)
        .map((title, i) => (
          <NoteLink title={title} />
        ))} -
      </div>
    )
  }


  return (
    <div>
      <h2 id='backlinksTitle'>{title}</h2>
      <div className='backlinks'>
        {notes.map(({ title, tags, wikilinks}) =>
          <div key={title} className='backlink'>
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