import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import React, { useEffect, useState, useCallback, createRef } from "react";
import { ALL_NOTES, FIND_NOTE } from "./query";
import NoteEditor from './NoteEditor'
import './index.css'
import { MdSearch, MdAccountBox, MdDelete } from 'react-icons/md'
import SearchField from './SearchField'
import { useCurrentNote } from "./useCurrentNote";
import { editorVar, zettelIdVar } from "./cache";
import useLogin from "./useLogin";

function App() {

  const [login] = useLogin({
    onCompleted: () => loadNotes()
  })

  const [markdown, setMarkdown] = useState('')

  const [loadNotes, { data: noteData }] = useLazyQuery(
    ALL_NOTES, { errorPolicy: 'all' }
  )

  const note = useCurrentNote({
    onCompleted: note => {
      const editor = editorVar()
      editor.setMarkdown(note.text)
    }
  })
  console.log({ note })

  useEffect(() => {
    login({
      variables: {
        username: 'TestUser',
        password: 'Password'
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const notes = noteData?.allNotes

  const getMainComponent = () => {
    switch ('editor') {
      case 'editor': return ((<NoteEditor onChange={_ => null} />))
      default: return (<div>Unknown view</div>)
    }
  }

  return (
    <div>
      <EditorFrame
        headerComponent={<SearchBar />}
        mainComponent={getMainComponent()}
        sidebarComponent={<NoteList notes={notes} />}
      />
    </div>
  )
}

const EditorFrame = ({ mainComponent, sidebarComponent, headerComponent }) => {
  return (
    <div>
      <div id='header'>
        {headerComponent}
      </div>

      <div id='root-container'>
        <div className='flexItem' id='note-editor' spellCheck="false">
          <div id='note-editor-padding'>
            {mainComponent}
          </div>
        </div>
        <div className='flexItem' id='note-sidebar'>
          {sidebarComponent}
        </div>
      </div>
    </div>
  )
}


const SearchBar = ({ searchOnClick, className }) => {
  const [findNote] = useLazyQuery(FIND_NOTE)

  return (
    <div id='top-bar'>
      <Button Icon={MdSearch} onClick={searchOnClick} />
      <SearchField
        onCreate={val => console.log(val) && findNote({ variables: { query: val}})}
        onSelect={zettelId => {
          console.log('onSelect', zettelId)
          zettelIdVar(zettelId)
        }}
      />
    </div>
  )
}


const NoteList = ({ notes }) => {
  if (!notes) return null

  return (
    <div id='notelistContainer'>
      <h2 id='backlinksTitle'>Backlinks</h2>
      <div id='notelist'>
        {notes.map(({ title, tags, zettelId }) =>
          <div key={zettelId} className='backlink'>
            <a href='/'> {title} </a>
            <div> {tags.map(tag => '#' + tag).join('  ')} </div>
            <br />
          </div>
        )}
      </div>
    </div>
  )
}


const Button = ({ Icon, onClick }) => {
  return (
    <button onClick={onClick}>
      <Icon />
    </button>
  )
}

export default App;


const Dropdown = ({ button, content, className }) => {
  return (
    <div className={className}>
      <div className='dropdown'>
        {button}
        <div className='dropdown-content'>
          {content}
        </div>
      </div>
    </div>
  )
}