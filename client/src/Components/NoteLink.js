import { useHistory, Link } from 'react-router-dom'

export const NoteLink = ({ title }) => {
  return (
    <Link to={`/${title}`}>{title}</Link>
  )
}

export const TagLink = ({ tag }) => {

}

export default NoteLink