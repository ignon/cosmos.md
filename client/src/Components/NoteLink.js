import history from '../utils/history'
import { withRouter, Link } from 'react-router-dom'

export const NoteLink = ({ title, style }) => {
  return (
    <div style={style}>
      <Link to={`/${title}`}>{title}</Link>
    </div>
  )
}

export const TagLink = ({ tag }) => {

}

export const InlineNoteLink = ({ history, title }) => {
  const handleClick = (e) => {
    e.preventDefault()
    history.push(title)
    // window.location.reload()
  }

  const link = `/${title}`

  return <a href={link} onClick={handleClick}>{`[[${title}]]`}</a>
}

export default withRouter(NoteLink)