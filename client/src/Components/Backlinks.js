import useNote from "../useNote";
import { useMediaQuery } from '@react-hook/media-query'

const Backlinks = () => {
  const note = useNote()
  const potrait = useMediaQuery('(max-width: 800px)')

  if (!note) return null


  console.log(({ potrait }))

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
      {<h1 className='note-title'>{note?.title || 'Unnamed'}</h1>}
      <h2 id='backlinksTitle'>{backlinkTitle}</h2>
      <div className='backlinks'>
        {backlinks.map(({ title, tags, zettelId, wikilinks}) =>
          <div key={zettelId} className='backlink'>
            <a className='title' href='/'> {title} </a>
            <div className='tags'>{tags.map(tag => '#' + tag).join(' ')} </div>
            <div className='wikilink'>- {wikilinks
              .filter(title => title !== note.title)
              .join(', ')} -</div>
          </div>
        )}
        {backlinks.length === 0 && <div>No backlinks</div>}
      </div>
      {!potrait && (
        <div>
          <h2 id='backlinksTitle'>References notes</h2>
          <div className='backlinks'>
            <div>
              {wikilinks.map(title =>
                <div key={title} className='backlink'>
                  <a href='/'> {title} </a>
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

export default Backlinks