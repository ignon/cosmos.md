/* eslint-disable react-hooks/exhaustive-deps */

import 'semantic-ui-css/semantic.min.css'
import '../styles/index.css'
import { useReactiveVar } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import NoteEditor from './NoteEditor'
import { MdSearch } from 'react-icons/md'
import SearchField from './SearchField'
import useNote from "../useNote";
import { editorVar } from "../cache";
import useLogin from "../useLogin";
import Button from './Button'
import EditorFrame from './EditorFrame'
import Backlinks from './Backlinks'
import { useState } from "react/cjs/react.development";
import { useTimer, until } from '../utils/utils'
import useEditNote from '../operations/mutations/editNote'
import TagField from './TagField'
import { useHistory } from "react-router";
import LoginForm from './LoginForm.js'
import { Link } from 'react-router-dom'
import RegisterForm from './RegisterForm';
// import { Button as SButton } from 'semantic-ui-react'

function App() {

  const [text, setText] = useState('')
  const { isLoggedIn } = useLogin({ onCompleted: () => {
    alert('refresh')
  } })
  const { timerCompleted, setTimer } = useTimer(0.1)

  const editor = useReactiveVar(editorVar)

  const { editNote } = useEditNote()

  const note = useNote({
    onChange: async note => {
      await until(() => (editor))
      editor.setMarkdown(note.text)
      setText(note.text)
    }
  })

  document.note = { ...note, text }


  useEffect(() => {
    if (isLoggedIn && note && note.text !== text && timerCompleted) {
      const text = editor.getMarkdown()
      if (text) {
        editNote({ ...note, text })
        setTimer(1)
      }
    }
  }, [isLoggedIn, text, timerCompleted])

  const handleTextChange = text => {
    setText(text)
  }

  return (
    <div>
      <EditorFrame
        headerComponent={<TopBar onLogin={() => {}}/>}
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
    history.push('cosmos')
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
            <TagField />
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

  const searchOnClick = () => {
    searchFieldRef.current?.focus()
  }

  const handleNoteSelect = title => {
    history.push(title) 
  }

  const handleNoteCreate = title => {
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

export default App;