/* eslint-disable react-hooks/exhaustive-deps */
import { EDIT_NOTE, EDIT_NOTE_STRING } from '../query'
import { useMutation } from '@apollo/client'
import { useEffect } from 'react'
import config from '../config'
const { SERVER_URL } = config


const onPageExit = () => {
  if (document.visibilityState === 'hidden') {
    const { title, zettelId, text } = document.note
    const note = { title, zettelId, text }
    const token = localStorage.getItem('token')

    const authorization = `Bearer ${token}`
    const headers = { type: 'text/plain' }

    const json = {
      operationName: 'editNote',
      query: EDIT_NOTE_STRING,
      variables: { note },
      authorization
    }

    const blob = new Blob([JSON.stringify(json)], headers)
    navigator.sendBeacon(SERVER_URL, blob)
  }
}


const useEditNote = () => {
  const [editNote] = useMutation(EDIT_NOTE)

  useEffect(() => {
    document.addEventListener('visibilitychange', onPageExit)
  })

  const wrappedEditNote = (note) => {
    const { title, zettelId, text } = note
    const myNote = { title, zettelId, text }
    console.log('edit note:', myNote)
    editNote({ variables: { note: myNote }})
  }

  return { editNote: wrappedEditNote }
}

export default useEditNote

