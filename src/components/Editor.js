import { useState } from 'react'
import React from 'react'
import CodeMirror from 'react-codemirror'
require('codemirror/lib/codemirror.css');


const Editor = () => {
  const [text, setText] = useState('moi :3')

  return (
    <CodeMirror value={text} onChange={setText} options={{ lineNumbers: true }} />
  )
}


export default Editor