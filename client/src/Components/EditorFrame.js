const EditorFrame = ({ mainComponent, sidebarComponent, headerComponent }) => {
  return (
    <div>
      <div id='header'>
        {headerComponent}
      </div>

      <div id='root-container'>
        <div className='flexItem' id='note-editor' spellCheck="false">
          <div id='note-editor-padding'>
            {mainComponent}
          </div>
        </div>
        <div className='flexItem' id='note-sidebar'>
          {sidebarComponent}
        </div>
      </div>
    </div>
  )
}

export default EditorFrame