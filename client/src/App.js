import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState, useCallback, createRef } from "react";
import { ALL_NOTES, LOGIN } from "./query";
import TopBar from './TopBar'
import NoteEditor from './NoteEditor'
import './index.css'
import { MdMenu, MdSearch, MdAccountBox, MdDelete } from 'react-icons/md'

function App() {

  const [login, stuff] = useMutation(LOGIN)
  const [markdown, setMarkdown] = useState('')

  const [ loadNotes, { data: noteData } ] = useLazyQuery(
    ALL_NOTES, { errorPolicy: 'all' }
  )

  useEffect(() => {
    login({
      variables: {
        username: 'TestUser',
        password: 'Password'
      }
    })
      .then(async ({ data }) => {
        const token = (data?.login.token) 
        console.log({ token })

        if (token) {
          localStorage.setItem('token', token)
        }
        await new Promise(r => setTimeout(r, 2000))
        loadNotes()
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const notes = noteData?.allNotes

  return (
    <div>
      <div id='header'>
        {/* <TopBar refetchNotes={refetchNotes} /> */}
        {/* <Button icon={MdSearch} /> */}
        {/* <MdMenu /> */}
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
          <div key={zettelId} className='backlink'>
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