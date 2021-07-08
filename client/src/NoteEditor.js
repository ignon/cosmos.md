import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { Editor } from '@toast-ui/react-editor'
import { useEffect, useRef } from 'react'

const NoteEditor = ({ height, text, onChange }) => {

  const editorRef = useRef()
  const editor = editorRef.current?.editorInst
  if (editor) {
    // editor.setMarkdown(text)
    // editor.ii8n.setCode('')
  }


  const onKeyup = () => {
    const text = document.querySelector('#editorContent')
    console.log({ text })
    // if (onChange) { onChange(text) }
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
      onLoad={(...args) => console.log('onLoad', args)}
      onKeyup={onKeyup}
      language='none'
    />
  )
}

export default NoteEditor