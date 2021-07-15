import useNote from "../useNote";

const Backlinks = () => {
  const note = useNote()
  if (!note) return null

  const { backlinks, wikilinks } = note


  return (
    <div id='notelistContainer'>
      <h2 id='backlinksTitle'>Backlinks</h2>
      <div id='notelist'>
        <div>
          {backlinks.map(({ title, tags, zettelId, wikilinks}) =>
            <div key={zettelId} className='backlink'>
              <a href='/'> {title} </a>
              <div className=''>{tags.map(tag => '#' + tag).join(' ')} </div>
              <div className='wikilink'>- {wikilinks
                .filter(title => title !== note.title)
                .join(', ')} -</div>
              <br />
            </div>
          )}
        </div>
        {backlinks.length === 0 && <div>No backlinks</div>}
        <h2 id='backlinksTitle'>Wikilinks</h2>
        <div>
          {wikilinks.map(title =>
            <div key={title} className='backlink'>
              <a href='/'> {title} </a>
              <br />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Backlinks