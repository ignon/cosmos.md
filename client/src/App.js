import { useApolloClient, useLazyQuery, readFragment, useReactiveVar, gql } from "@apollo/client";
import React, { useEffect, useState, useCallback, createRef } from "react";
import { FIND_NOTE } from "./query";
import NoteEditor from './NoteEditor'
import './index.css'
import { MdSearch, MdAccountBox, MdDelete } from 'react-icons/md'
import SearchField from './SearchField'
import useNote from "./useNote";
import { editorVar, noteVar, zettelIdVar } from "./cache";
import useLogin from "./useLogin";

function App() {

  const [login] = useLogin({ onCompleted: _ => true })

  useEffect(() => {
    login({
      variables: {
        username: 'TestUser',
        password: 'Password'
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const editor = useReactiveVar(editorVar)
  const note = useNote({
    onChange: note => {
      console.log('APP COMPLETED ', { note })
      if (editor && note) {
        editor.setMarkdown(`# ${note.title}\n${note.text}`)
      }
    }
  })
  console.log({ note })
  

  const client = useApolloClient()
  const zettelId = zettelIdVar()
  const note2 = client.readFragment({
    id: `Note:${zettelId}`,
    fragment: gql`fragment MyNote on Note { zettelId, text }`
  })
  console.log({ note2 })

  // useEffect(() => { }, [note, editor])


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
        sidebarComponent={<NoteList />}
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
  const client = useApolloClient()

  const [findNote] = useLazyQuery(FIND_NOTE, {
    onCompleted({ findNote: note }) {
      console.log('onComplete', { note })
      noteVar(note)

      const { zettelId } = note
      zettelIdVar(zettelId)
    }
  })


  // const cache = client.readQuery({
  //   query: FIND_NOTE,
  //   variables: zettelIdVar()
  // })
  // console.log({ cache })

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
      />
    </div>
  )
}



const NoteList = () => {
  const note = useNote()
  if (!note) return null

  const { backlinks } = note


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