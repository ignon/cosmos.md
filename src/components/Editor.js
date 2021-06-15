import { useState, useRef } from 'react'
import React from 'react'
import CodeMirror from 'react-codemirror'
import 'hypermd'
import 'hypermd/core';
import 'hypermd/mode/hypermd';
import 'codemirror/lib/codemirror.css'


const Editor = () => {
  const [text, setText] = useState(`
# Otsikko
*moi*
**hei**
  `)

  const editorRef = useRef()

  const options = {
    lineNumbers: false,
    smartIndent: true,
    tabSize: 4,
    indentWithTabs: false,
    lineWrapping: true,
    mode: 'hypermd',
    theme: 'hypermd-light',
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
    // autoFocus: true
    // gutters: []
    // scrollbarStyle
    // readOnly: true
  }

  return (
    <CodeMirror
      value={text}
      onChange={setText}
      options={options}
      ref={editorRef}
      autoFocus={true}
      className='moih'
      codeMirrorInstance={ require('codemirror') }
    />
  )
}


export default Editor