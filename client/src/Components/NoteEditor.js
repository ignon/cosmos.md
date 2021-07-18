import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { Editor } from '@toast-ui/react-editor'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom';
import { until } from '../utils/utils'
import { editorVar } from '../cache';
import { InlineNoteLink } from './NoteLink'
import { useHistory } from 'react-router';

const NoteEditor = ({ onChange }) => {

  const editorRef = useRef()

  const getEditor = () => editorRef.current?.editorInst
  const editor = getEditor()
  const history = useHistory()


  useEffect(() => {
    const editorMount = async () => {
      await until(() => (getEditor()))
      const editor = getEditor()
      editorVar(editor)

      // Force editor to resize
      window.dispatchEvent(new Event('resize'));
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

  const wikilinkRE = /\[\[(.*?)\]\]/
  const hashtagRE = /#\S+[ $\n]/

  return (
    <Editor
      initialValue=''
      initialEditType='markdown'
      previewStyle='tab'
      height='100%'
      ref={editorRef}
      frontMatter={true}
      theme='light'
      onKeyup={onKeyup}
      language='none'
      widgetRules={[
        {
          rule: wikilinkRE,
          toDOM: (text) => {
            const rule = wikilinkRE
            const matched = text.match(rule)
            const span = document.createElement('span')

            const title = matched[1]
            ReactDOM.render(
              <span>
                <InlineNoteLink history={history} title={title} />
              </span>,
              span
            )
            return span
          }
        },
        {
          rule: hashtagRE,
          toDOM: (text) => {
            const rule = hashtagRE
            const matched = text.match(rule)
            const span = document.createElement('span')
            const title = matched[0]
            span.innerHTML = `<a class="widget-anchor" href="/${title}">${title}</a>`
            return span
          }
        },
      ]}
      toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['quote', 'image', 'link'],
          ['code', 'codeblock']
          // ['ul', 'ol', 'task'],
          // ['table', /*'image',*/ 'link'],
          // ['code', 'codeblock'],
      ]}
    />
  )
}

export default NoteEditor