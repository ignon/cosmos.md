import useNote from "../useNote";
import { useMediaQuery } from '@react-hook/media-query'
import NoteLink from './NoteLink'
import { editorVar } from "../cache";
import parseNote from "../markdown/noteParser";

const styles = {
  noteContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wikilinks: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: '140px',
    maxWidth: '140px',
    display: 'inline-block'
  },
  wikilink: {
    display: 'inline-block'
  }
}

const getBacklinkTitle = (count) => {
  switch (count) {
    case 0: return 'Linked references'
    case 1: return '1 linked reference'
    default: return `${count} linked references`
  }
}

const getWikilinkTitle = (count) => {
  switch (count) {
    case 0: return 'References'
    case 1: return '1 reference'
    default: return `${count} references`
  }
}


const Backlinks = () => {
  const note = useNote()
  const potrait = useMediaQuery('(max-width: 800px)')

  const editor = editorVar()
  const text = editor?.getMarkdown()

  if (!note) return null
  if (!text) return null


  const currentNote = {
    ...note,
    ...parseNote({ ...note, text })
  }


  const { title, backlinks, wikilinks, tags } = currentNote


  const backlinkTitle = getBacklinkTitle(backlinks.length)
  const wikilinkTitle = getWikilinkTitle(wikilinks.length)

  return (
    <div id='notelistContainer'>
      <NoteTitle title={title} />
      <NoteList
        title={backlinkTitle}
        emptyMessage={'No backlinks'}
        currentNote={currentNote}
        notes={backlinks}
      />
      <WikilinkList
        title={wikilinkTitle}
        emptyMessage='No referenced notes'
        currentNote={note}
        notes={wikilinks}
        skipIf={potrait}
      />
      <TagList
        title='Hashtags'
        tags={tags}
        skipIf={potrait}
        emptyMessage='No hashtags'
      />
    </div>
  )
}


const NoteTitle = ({ title, skipIf }) => ( 
  <h1 className='note-title'>{title || 'Unnamed'}</h1>
 )

const TagList = ({ tags, title, emptyMessage, skipIf }) => {
  if (skipIf === true) {
    return false
  }

  return (
    <SidebarContainer title={title}>
      {tags.map(tag => (
        <div key={tag} className='tag'>
          <a href='/'> {'#' + tag}</a>
        </div>
      ))}
      {tags.length === 0 && <div>{emptyMessage}</div>}
    </SidebarContainer>
  )
}

const NoteList = ({ currentNote, title, notes, emptyMessage, skipIf }) => {

  if (skipIf === true) {
    return false
  }

  // const renderTags = (tags=[]) => {
  //   return (
  //     <div className='tags'>{tags.map(tag => '#' + tag).join(' ')} </div>
  //   )
  // }

  const renderWikilinks = (wikilinks=[]) => {

    const noteLinks = wikilinks
      .filter(title => wikilinks.length === 1 || title !== currentNote.title)
      .map(title =>
        <NoteLink title={title} key={title} />
      )

    return (
      <div className='wikilinks'>
        {noteLinks}
      </div>
    )
  }

  return (
    <SidebarContainer title={title}>
      {notes.map(({ title, tags, wikilinks }) => ( 
        <div key={title} className='backlink' style={styles.wikilinks}>
          <NoteLink title={title} style={{flexGrow: 1}}/>
          {renderWikilinks(wikilinks)}
          {/* {renderTags(tags)} */}
        </div>
       ))}
      {notes.length === 0 && <div>{emptyMessage}</div>}
    </SidebarContainer>
  )
}

const WikilinkList = ({ notes, title, skipIf, emptyMessage }) => {
  if (skipIf === true) {
    return null
  }

  return (
    <SidebarContainer title={title}>
      {notes.map(title => {
        return (
          <div key={title} className='wikilinks' style={styles.wikilinks}>
            <NoteLink title={title} />
          </div>
        )
      })}
      {notes.length === 0 && <div>{emptyMessage}</div>}
    </SidebarContainer>
  )
}


const SidebarContainer = ({ children, title }) => {
  return (
    <div>
      <h2 id='backlinksTitle'>{title}</h2>
      <div className='backlinks' style={styles.noteContainer}>
        {children}
      </div>
    </div>
  )
}

export default Backlinks