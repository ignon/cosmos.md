/* eslint-disable react-hooks/exhaustive-deps */

import { useReactiveVar } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import NoteEditor from './NoteEditor'
import './index.css'
import { MdSearch, MdAccountBox, MdDelete } from 'react-icons/md'
import SearchField from './SearchField'
import useNote from "./useNote";
import { editorVar } from "./cache";
import useLogin from "./useLogin";
import Button from './Button'
import EditorFrame from './Components/EditorFrame'
import Backlinks from './Components/Backlinks'
import { useState } from "react/cjs/react.development";
import { useTimer } from './utils'
import useEditNote from './hooks/editNote'
import TagField from './Components/TagField'
import { until } from './utils'
import { useHistory } from "react-router";

function App() {

  console.log('APP')
  const [text, setText] = useState('')
  const { login, isLoggedIn } = useLogin({ onCompleted: _ => true })
  const { timerCompleted, setTimer } = useTimer(0.1)


  useEffect(() => {
    login({ username: 'TestUser', password: 'Password' })
  }, [])


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
        setTimer(0.1)
      }
    }
  }, [isLoggedIn, text, timerCompleted])

  const handleTextChange = text => {
    setText(text)
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
  return (
    <div id='top-bar'>
      <SearchBar />
      <TagField />
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