import { useQuery, } from "@apollo/client";
import { useEffect, useRef, useState, useCallback, createRef } from "react";
import { ALL_NOTES } from "./query";
import TopBar from './TopBar'
import NoteEditor from './NoteEditor'
import './index.css'
import { MdMenu, MdSearch, MdAccountBox, MdDelete } from 'react-icons/md'

function App() {

  const [markdown, setMarkdown] = useState('')

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
        <div className='flexItem' id='note-editor' spellCheck="false">
          <div id='note-editor-padding'>
            <NoteEditor onChange={text => setMarkdown(text)} />
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