import { useState, useRef, useEffect } from 'react'
import React from 'react'
import CodeMirror from 'codemirror'
import { Controlled as ReactCodeMirror } from 'react-codemirror2'
import 'hypermd'
// import 'hypermd/core';
// import 'hypermd/mode/hypermd';
import 'codemirror'
import '../styles/hypermd-dracula.scss'
import './vim'
import 'hypermd/powerpack/fold-emoji-with-emojione'
import 'hypermd/powerpack/fold-emoji-with-twemoji'
import 'emojione'
import 'twemoji'
import 'turndown'

// import 'hypermd/core';
// import 'hypermd/mode/hypermd';

// import 'hypermd/addon/hide-token';
// import 'hypermd/addon/cursor-debounce';
// import 'hypermd/addon/fold';
// import 'hypermd/addon/read-link';
// import 'hypermd/addon/click';
// import 'hypermd/addon/hover';
// import 'hypermd/addon/paste';
// import 'hypermd/addon/insert-file';
// import 'hypermd/addon/mode-loader';
// import 'hypermd/addon/table-align';

import axios from 'axios'

const Editor = () => {
  const [text, setText] = useState(`
# Otsikko
*moi*
**hei**
  `)

  useEffect(() => {
    axios
      .get('https://raw.githubusercontent.com/laobubu/HyperMD/master/README.md')
      .then(response => {
        setText(response.data)
      })
  }, [])

  const editorRef = useRef()

  const options = {
    lineNumbers: false,
    smartIndent: true,
    tabSize: 4,
    indentWithTabs: false,
    lineWrapping: true,
    // mode: 'hypermd',
    mode: 'hypermd',
    theme: 'hypermd-dracula',
    hmdFold: {
      image: true,
      link: true,
      math: true,
    },
    hmdHideToken: true,
    hmdCursorDebounce: true,
    hmdPaste: true,
    hmdClick: true,
    hmdHover: true,
    hmdTableAlign: true,
    hmdFoldHtml: { enabled: true }
    // keyMap: "vim",
    // autoFocus: true
    // gutters: []
    // scrollbarStyle
    // readOnly: true
  }

  const [editor, setEditor] = useState(null)

  const resize = (editor) => {
    const container = document.getElementById('root')
    const containerHeight = container.offsetHeight
    editor.setSize(null, containerHeight)
    CodeMirror.Vim.map('jk', '<Esc>', 'insert')
  }

  window.onresize = () => resize(editor)

  return (
    <ReactCodeMirror
      value={text}
      // style={{ height: '100%' }}
      onBeforeChange={(editor, data, value) => setText(value)}
      editorDidMount={(editor) => {
        setEditor(editor)
        resize(editor)
      }}
      onViewportChange={resize}
      // onChange={(...args) => console.log(args)}
      options={options}
      ref={editorRef}
      autoFocus={true}
      className='moih'
      codeMirrorInstance={CodeMirror}
    />
  )
}


export default Editor