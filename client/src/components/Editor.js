import React from 'react'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import CodeMirror from 'codemirror'
import { Controlled as ReactCodeMirror } from 'react-codemirror2'
import 'hypermd'
// import 'hypermd/core';
// import 'hypermd/mode/hypermd';
import 'codemirror'
import '../styles/hypermd-dracula.scss'
import './vim'
import 'hypermd/powerpack/fold-emoji-with-emojione'
// import 'hypermd/powerpack/fold-emoji-with-twemoji'

import 'codemirror/mode/yaml/yaml'
import 'codemirror/mode/htmlmixed/htmlmixed' // for embedded HTML
import 'codemirror/mode/stex/stex' // for Math TeX Formular
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';

import 'emojione'
import 'turndown'
import 'katex'
// import mathjax from 'mathjax'

// mathjax.init({
//   loader: {load: ['input/tex', 'output/svg']}
// })


// import 'twemoji/dist/twemoji.amd'
// import 'hypermd/powerpack/fold-emoji-with-twemoji'
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

// import completeEmoji from 'hypermd/goods/complete-emoji'

// 2/twemoji.amd.js


// "hypermd": "git+ssh://git@github.com/ignon/HyperMD.git",


const Editor = () => {
  const [text, setText] = useState(`
    # Otsikko
    *moi*
    **hei**
  `)

  useEffect(() => {
    axios
      .get('https://raw.githubusercontent.com/vuejs/rfcs/master/README.md')
      .then(response => {
        setText(response.data)
      })
  }, [])

  const editorRef = useRef()

  const options = {
    // lineNumbers: true,
    smartIndent: true,
    tabSize: 4,
    indentWithTabs: false,
    lineWrapping: true,
    // mode: 'hypermd',
    mode: {
      name: 'hypermd',
      hashtag: true,
      front_matter: true,
      math: true
    },
    theme: 'hypermd-light',
    hmdFold: {
      image: true,
      link: true,
      math: true,
      html: true, // injections and stuff!!!!
      emoji: true
    },
    hmdHideToken: true,
    hmdCursorDebounce: true,
    hmdPaste: true,
    hmdClick: true,
    hmdHover: true,
    hmdTableAlign: true,
    // extraKeys: {
    //   "Ctrl-Space": "autocomplete",   // Use Ctrl+Space to
    // },
    // hintOptions: {
    //   hint: completeEmoji.createHintFunc()
    // },
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