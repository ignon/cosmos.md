import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { Editor } from '@toast-ui/react-editor'
import { useEffect, useRef } from 'react'
import axios from 'axios'
import { until } from './utils'

const NoteEditor = ({ height, text, onChange }) => {

  const editorRef = useRef()
  const editor = editorRef.current?.editorInst

  console.log({ editor })

  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/rust-lang/rfcs/master/README.md')
      .then(async (result) => {

        await until(() => (editor))
        
        const text = result.data
        editor.setMarkdown(text)
      })
  }, [editor])


  const onKeyup = () => {
    // const text = document.querySelector('#editorContent')
    const text = editor.getMarkdown()
    console.log({ text })
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
      initialEditType='wysiwyg'
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