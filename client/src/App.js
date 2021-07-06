import { useMutation, useQuery, useApolloClient } from "@apollo/client";
import { useEffect, useState, useCallback, useRef } from "react";
import { ALL_NOTES, LOGIN, REGISTER } from "./query";
import TopBar from './TopBar'
import NoteEditor from './NoteEditor'
import './index.css'
import useRefDimensions from "./useDimensions";

function App() {

  const divRef = useRef()
  const { height } = useRefDimensions(divRef)



  console.log(height)
  console.log('--- RENDER ---')

  const {
    data: noteData,
    error: noteError,
    refetch: refetchNotes
  } = useQuery(ALL_NOTES, { errorPolicy: 'all' })

  console.log({ noteData, noteError })

  const notes = noteData?.allNotes

  return (
    <div>
      <div id='header'>
        <TopBar refetchNotes={refetchNotes} />
      </div>

      <div id='root-container'>
        <div className='flexItem' id='note-editor' ref={divRef}>
          <NoteEditor height={height}/>
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