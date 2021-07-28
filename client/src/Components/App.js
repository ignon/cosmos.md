import 'semantic-ui-css/semantic.min.css'
import '../styles/index.css'
import { useReactiveVar } from '@apollo/client'
import React, { useEffect, useRef } from 'react'
import NoteEditor from './NoteEditor'
import { MdSearch } from 'react-icons/md'
import SearchField from './SearchField'
import useNote from '../useNote'
import { editorVar, noteVar } from '../cache'
import useLogin from '../useLogin'
import Button from './Button'
import EditorFrame from './EditorFrame'
import Backlinks from './Backlinks'
import { useState } from 'react'
import { useTimer, until } from '../utils/utils'
import useEditNote from '../operations/mutations/editNote'
import { useHistory } from 'react-router'
import LoginForm from './LoginForm.js'
import { Link } from 'react-router-dom'
import RegisterForm from './RegisterForm'
import { DEFAULT_NOTE } from '../utils/config.js'


function App() {

  const { isLoggedIn } = useLogin()
  const [ text, setText] = useState('')
  const { timerCompleted, setTimer } = useTimer(0.1)
  const editor = useReactiveVar(editorVar)

  const { editNote } = useEditNote()

  const note = useNote({
    onChange: async note => {
      await until(() => (editor))
      editor.setMarkdown(note.text)

      const { title, zettelId, text } = note
      noteVar({ title, zettelId, text })
      setText(note.text)
    }
  })

  console.log({ note: noteVar() })

  // Beacon API and sendBeacon doesn't seem to be be able to access
  // variables from React context so...
  // I try to come up with a more orthodox solution but for now..
  document.note = { ...note, text }


  useEffect(() => {
    const textHasChanged = (note && note.text !== text)
    if (isLoggedIn && textHasChanged && timerCompleted) {
      editNote()
      setTimer(1)
    }
  }, [isLoggedIn, text, timerCompleted])

  const handleTextChange = text => {
    setText(text)
    const { title, zettelId } = note
    noteVar({ title, zettelId, text })
  }

  return (
    <div>
      <EditorFrame
        headerComponent={<TopBar />}
        mainComponent={<NoteEditor onChange={handleTextChange} />}
        sidebarComponent={<Backlinks />}
      />
    </div>
  )
}


const TopBar = () => {
  const history = useHistory()
  const { isLoggedIn, logout } = useLogin()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)


  const onLogout = () => {
    logout()
    history.push(DEFAULT_NOTE)
  }

  return (
    <div id='top-bar'>
      <LoginForm open={loginOpen} setOpen={setLoginOpen}/>
      <RegisterForm open={registerOpen} setOpen={setRegisterOpen} />
      <SearchBar />
      <div style={{display: 'flex', flexDirection: 'row', margin: 0, padding: 0, alignItems: 'center'}}>
        {!isLoggedIn 
          ? <>
            <Link onClick={() => setLoginOpen(true)}>Login</Link>
            <Link onClick={() => setRegisterOpen(true)}>Register</Link>
          </>
          : <>
            {/* <TagField /> */}
            <Link onClick={onLogout}>Logout</Link>
          </>
        }
      </div>
    </div>
  )
}


const SearchBar = () => {
  const history = useHistory()
  const searchFieldRef = useRef()
  const { isLoggedIn } = useLogin()
  const { editNote } = useEditNote()

  const searchOnClick = () => {
    searchFieldRef.current?.focus()
  }

  const handleNoteSelect = title => {
    editNote()
    history.push(title) 
  }

  const handleNoteCreate = title => {
    if (!isLoggedIn) {
      alert('You are not logged in, created notes won\'t be saved')
    }
    editNote()
    history.push(title) 
  }

  return (
    <div id='search-container'>
      <Button Icon={MdSearch} onClick={searchOnClick} />
      <SearchField
        onCreate={handleNoteCreate}
        onSelect={handleNoteSelect}
        fieldRef={searchFieldRef}
      />
    </ div>
  )
}

export default App