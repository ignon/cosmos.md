import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState, useCallback, createRef } from "react";
import { ALL_NOTES, LOGIN } from "./query";
// import TopBar from './TopBar'
import FocusTrap from 'focus-trap-react'
import NoteEditor from './NoteEditor'
import './index.css'
import { MdMenu, MdSearch, MdAccountBox, MdDelete } from 'react-icons/md'

function App() {

  const [view, setView] = useState('editor')
  const [login] = useMutation(LOGIN)
  const [markdown, setMarkdown] = useState('')

  const [ loadNotes, { data: noteData } ] = useLazyQuery(
    ALL_NOTES, { errorPolicy: 'all' }
  )

  console.log({ view })

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


  const getMainComponent = (view) => {
    switch(view) {
      case 'search': return (<Search notes={notes} />)
      case 'editor': return ((<NoteEditor onChange={text => setMarkdown(text)} /> ))
      default:       return (<div>Unknown view</div>)
    }
  }

  return (
    <EditorFrame
      headerComponent={(<TopBar
        searchOnClick={() => setView(view === 'search' ? 'editor' : 'search')}
      />)}
      mainComponent={getMainComponent(view)}
      sidebarComponent={( <NoteList notes={notes} />)}
    />
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

// const Search = ({ notes }) => {
//   if (!notes) return <div>Loading...</div>
//   return (
//     <div>
//       <h2>Seach</h2>
//       { notes.map(note => <div id={note.zettelId}>{note.title}</div>) }
//     </div>
//   )
// }


const TopBar = ({ searchOnClick, className }) => {
  return (
    <div className='search-dropdown'>
      <Dropdown
        button={<Button Icon={MdSearch} onClick={searchOnClick} />}
        content={<SearchItems />}
      />
      {/* <div>
        
        <MdAccountBox />
        <MdDelete />
      </div> */}
    </div>
  )
}

// const SearchItems = () => {
//   const notes = Array(10).fill({ title: 'Lorem Ipsum'})

//   return (
//     <FocusTrap active={false} focusTrapOptions={{ displayCheck: 'none' }}>
//       <div className='trap'>
//         <a href='/'>Moi:3</a>

//         {/* {notes.map(note => <select className='search-item' href='/'>{note.title}</select>)} */}
//       </div>
//     </FocusTrap>
//   )
// }

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