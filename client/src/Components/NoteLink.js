import { withRouter, Link, useHistory } from 'react-router-dom'
import useEditNote from '../operations/mutations/editNote'
// import useEditNote from '../operations/mutations/editNote'
// import useNote from '../useNote'

export const NoteLink = ({ title, style }) => {
  const { editNote } = useEditNote()
  const history = useHistory()

  const onClick = (e) => {
    e.preventDefault()
    editNote()
    history.push(title)
  }

  return (
    <div style={style}>
      <Link onClick={onClick} to={`/${title}`}>{title}</Link>
    </div>
  )
}


export const InlineNoteLink = ({ beforeLinkClick, history, title }) => {

  const handleClick = (e) => {
    e.preventDefault()
    beforeLinkClick?.()
    history.push(title)
  }

  const link = `/${title}`

  return <a href={link} onClick={handleClick}>{`[[${title}]]`}</a>
}


export default withRouter(NoteLink)