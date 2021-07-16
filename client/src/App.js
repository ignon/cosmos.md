/* eslint-disable react-hooks/exhaustive-deps */

import { useMutation, useLazyQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { FIND_NOTE } from "./query";
import NoteEditor from './NoteEditor'
import './index.css'
import { MdSearch, MdAccountBox, MdDelete } from 'react-icons/md'
import SearchField from './SearchField'
import useNote from "./useNote";
import { editorVar, zettelIdVar } from "./cache";
import useLogin from "./useLogin";
import Button from './Button'
import EditorFrame from './Components/EditorFrame'
import Backlinks from './Components/Backlinks'
import { useState } from "react/cjs/react.development";
import { useTimer } from './utils'
import useEditNote from './hooks/editNote'
import TagField from './Components/TagField'
import { useRouteMatch } from 'react-router-dom'

function App() {

  console.log('APP')
  const [text, setText] = useState('')
  const { login, isLoggedIn } = useLogin({ onCompleted: _ => true })
  const { timerCompleted, setTimer } = useTimer(0.1)


  useEffect(() => {
    login({ username: 'TestUser', password: 'Password' })
  }, [])


  // const noteQueryMatch = useRouteMatch('/:query')
  // const query = noteQueryMatch?.params.query
  // console.log({ query })

  const editor = useReactiveVar(editorVar)

  const { editNote } = useEditNote()

  const note = useNote({
    onChange: note => {
      console.log({ note })
      editor?.setMarkdown(note.text)
      setText(note.text)
    }
  })

  document.note = { ...note, text }




  useEffect(() => {
    if (isLoggedIn && note && note.text !== text && timerCompleted) {
      editNote({ ...note, text })
      setTimer(1)
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

  const searchFieldRef = useRef()

  const [findNote] = useLazyQuery(FIND_NOTE, {
    onCompleted({ findNote: note }) {
      zettelIdVar(note.zettelId)
    }
  })

  const searchOnClick = () => {
    searchFieldRef.current?.focus()
  }

  const handleNoteSelect = zettelId => {
    findNote({ variables: { zettelId }})
  }

  const handleNoteCreate = title => {
    console.log('ON_CREATE', title)
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


// const client = useApolloClient()
// console.log({ cache: client.cache })
