import { useQuery, } from "@apollo/client";
import { useEffect, useRef, useState, useCallback, createRef } from "react";
import { ALL_NOTES } from "./query";
import TopBar from './TopBar'
import NoteEditor from './NoteEditor'
import './index.css'
import { useWindowSize, useRefDimensions } from "./useDimensions";
import { MdMenu, MdSearch, MdAccountBox, MdDelete } from 'react-icons/md'

function App() {

  const [markdown, setMarkdown] = useState('')
  const [height, setHeight] = useState(null)
  // const div = useCallback(node => {
  //   if (node !== null) {
  //     const rect = node.getBoundingClientRect()
  //     setHeight(rect.height)
  //   }
  // }, [])
  // const [height, setHeight] = useState(null)
  const div = useRef()
  // const [height, setHeight] = useState(undefined)
  const { height: windowHeight } = useWindowSize()
  console.log({ windowHeight })

  useEffect(() => {
    const rect = div.current?.getBoundingClientRect()
    const { width, height } = rect
    console.log({ width, height })
    setHeight(height)
    console.log(height)
  }, [])


  const {
    data: noteData,
    error: noteError,
    refetch: refetchNotes
  } = useQuery(ALL_NOTES, { errorPolicy: 'all' })

  console.log(markdown)

  const notes = noteData?.allNotes

  return (
    <div>
      <div id='header'>
        {/* <TopBar refetchNotes={refetchNotes} /> */}
        {/* <Button icon={MdSearch} /> */}
        <MdMenu />
        <MdSearch />
        <MdAccountBox />
        <MdDelete />
      </div>

      <div id='root-container'>
        <div className='flexItem' id='note-editor' ref={div} spellCheck="false">
          <div id='note-editor-padding'>
            <NoteEditor height={height} onChange={text => setMarkdown(text)} />
          </div>
        </div>
        <div className='flexItem' id='note-sidebar'>
          <NoteList notes={notes} />
        </div>
      </div>
    </div>
  )
}

const NoteList = ({ notes }) => {
  if (!notes) return null

  return (
    <div id='notelistContainer'>
      <h2 id='backlinksTitle'>Backlinks</h2>
      <div id='notelist'>
        {notes.map(({title, tags, zettelId}) =>
          <div key={zettelId} class='backlink'>
            <a href='/'> {title} </a>
            <div> {tags.map(tag => '#'+tag).join('  ')} </div>
            {/* <div> {zettelId} </div> */}
            <br />
          </div>
        )}
      </div>
    </div>
  )
}

const Button = ({ icon, onClick }) => {
  return (
    <button onClick={onClick}>
      <icon />
    </button>
  )
}

export default App;