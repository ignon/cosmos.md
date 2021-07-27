import { EDIT_NOTE, EDIT_NOTE_STRING } from '../../query'
import { useMutation } from '@apollo/client'
import { useEffect } from 'react'
import config from '../../utils/config'
import { noteVar } from '../../cache'
import useLogin from '../../useLogin'
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
  const { isLoggedIn } = useLogin()

  useEffect(() => {
    document.addEventListener('visibilitychange', onPageExit)
  })

  const wrappedEditNote = () => {
    if (isLoggedIn) {
      const note = noteVar()
      console.log('editNote', { note })
      const { title, zettelId, text } = note
      editNote({ variables: {
        note: { title, zettelId, text }
      }})
    }
  }

  return { editNote: wrappedEditNote }
}

export default useEditNote

