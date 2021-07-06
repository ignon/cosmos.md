import { useMutation, useQuery, useApolloClient } from "@apollo/client";
import { useEffect, useRef, useState, useCallback, createRef } from "react";
import { ALL_NOTES, LOGIN, REGISTER } from "./query";
import TopBar from './TopBar'
import NoteEditor from './NoteEditor'
import './index.css'
import { useWindowSize, useRefDimensions } from "./useDimensions";

function App() {

  // const [height, setHeight] = useState(null)
  // const div = useCallback(node => {
  //   if (node !== null) {
  //     const rect = node.getBoundingClientRect()
  //     setHeight(rect.height)
  //   }
  // }, [])
  const { height: windowHeight } = useWindowSize()
  console.log({ windowHeight })

  const div = useRef()
  const rect = div?.current?.getBoundingClientRect() ?? {}
  const { width, height } = rect
  console.log({ width, height })


  const {
    data: noteData,
    error: noteError,
    refetch: refetchNotes
  } = useQuery(ALL_NOTES, { errorPolicy: 'all' })

  console.log({ noteData, noteError })

  const notes = noteData?.allNotes

  return (
    <div style={{ height: '10px'}}>
      <div id='header'>
        <TopBar refetchNotes={refetchNotes} />
      </div>

      <div id='root-container'>
        <div className='flexItem' id='note-editor' ref={div}>
          <NoteEditor height={height} />
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
    <div>
      {notes.map(({title, tags, zettelId}) =>
        <div key={zettelId}>
          <div> {title} </div>
          <div> {tags.join(',  ')} </div>
          <div> {zettelId} </div>
          <br />
        </div>
      )}
    </div>
  )
}

export default App;