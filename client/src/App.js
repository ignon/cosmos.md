import { useApolloClient, useLazyQuery, useReactiveVar } from "@apollo/client";
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

function App() {

  const [login] = useLogin({ onCompleted: _ => true })

  useEffect(() => {
    login({ username: 'TestUser', password: 'Password' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editor = useReactiveVar(editorVar)

  useNote({
    onChange: note => {
      editor?.setMarkdown(`# ${note.title}\n${note.text}`)
    }
  })

  return (
    <div>
      <EditorFrame
        headerComponent={<SearchBar />}
        mainComponent={<NoteEditor onChange={_ => null} />}
        sidebarComponent={<Backlinks />}
      />
    </div>
  )
}




const SearchBar = ({ className }) => {

  const searchFieldRef = useRef()

  const [findNote] = useLazyQuery(FIND_NOTE, {
    onCompleted({ findNote: note }) {
      zettelIdVar(note.zettelId)
    }
  })

  const searchOnClick = () => {
    console.log(searchFieldRef)
    searchFieldRef.current?.focus()
  }

  const client = useApolloClient()
  console.log({ cache: client.cache })

  return (
    <div id='top-bar'>
      <Button Icon={MdSearch} onClick={searchOnClick} />
      <SearchField
        onCreate={val => console.log(val) && findNote({ variables: { query: val}})}
        onSelect={zettelId => {
          console.log('ON_SELECT', zettelId)
          findNote({ variables: { zettelId } })
        }}
        fieldRef={searchFieldRef}
      />
    </div>
  )
}

export default App;