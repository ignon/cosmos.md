import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { Editor } from '@toast-ui/react-editor'
import { useEffect, useRef } from 'react'
import axios from 'axios'
import { until } from './utils'
import { editorVar } from './cache';

const NoteEditor = ({ onChange }) => {

  const editorRef = useRef()

  const getEditor = () => editorRef.current?.editorInst
  const editor = getEditor()


  useEffect(() => {
    const editorMount = async () => {
      await until(() => (getEditor()))
      const editor = getEditor()
      editorVar(editor)
    }

    editorMount()
  }, [])


  const onKeyup = () => {
    if (!editor)  return;

    const text = editor.getMarkdown()
    if (onChange) { onChange(text) }
  }

  useEffect(() => {
    const editor = editorRef.current
    const editorDiv = editor.rootEl.current
    editorDiv.classList.add('defaultEditorContainer')
  }, [])

  return (
    <Editor
      initialValue='toimiiko tää ees'
      initialEditType='markdown'
      previewStyle='tab'
      height={'100%'}
      ref={editorRef}
      frontMatter={true}
      theme='light'
      onKeyup={onKeyup}
      language='none'
    />
  )
}

export default NoteEditor