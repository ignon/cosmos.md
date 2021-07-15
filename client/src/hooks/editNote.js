/* eslint-disable react-hooks/exhaustive-deps */
import { EDIT_NOTE, EDIT_NOTE_STRING } from '../query'
import { useMutation } from '@apollo/client'
import { useEffect } from 'react'

const useEditNote = () => {
  const [editNote] = useMutation(EDIT_NOTE)

  // const onPageClose = () => {
  //   const token = localStorage.getItem('token')
  //   const headers = {
  //     authorization: `Bearer ${token}`,
  //   }
  // }

  const wrappedEditNote = (note) => {
    const { title, zettelId, text } = note
    const myNote = { title, zettelId, text }
    console.log('edit note:', myNote)
    editNote({ variables: { note: myNote }})
  }

  const onPageExit = () => {
    if (document.visibilityState === 'hidden') {
      const { title, zettelId, text } = document.note
      const note = { title, zettelId, text }
      const token = localStorage.getItem('token')

      const authorization = `Bearer ${token}`

      const headers = {
        type: 'text/plain',
        authorization
      }

      const json = {
        operationName: 'editNote',
        query: EDIT_NOTE_STRING,
        variables: { note },
        authorization
      }

      const blob = new Blob([JSON.stringify(json)], headers)
      navigator.sendBeacon('http://localhost:4000/graphql', blob)
    }
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', onPageExit)
  }, [])

  return { editNote: wrappedEditNote }
}

export default useEditNote