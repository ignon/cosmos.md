import { withRouter, Link } from 'react-router-dom'
// import useEditNote from '../operations/mutations/editNote'
// import useNote from '../useNote'

export const NoteLink = ({ title, style }) => {
  return (
    <div style={style}>
      <Link to={`/${title}`}>{title}</Link>
    </div>
  )
}

export const TagLink = ({ tag }) => {

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