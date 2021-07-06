import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor'
import { useState, useCallback } from 'react'

const NoteEditor = ({ height }) => {


  return (
    <Editor
      initialValue='Hello **react**  editors!'
      initialEditType='wysiwyg'
      previewStyle='vertical'
      height={height + 'px'}
    />
  )
}

export default NoteEditor