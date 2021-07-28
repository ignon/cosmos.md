import fs from 'file-system'
import path from 'path'
import Note from '../models/Note.js'
import User from '../models/User.js'
import config from '../utils/config.js'
import { parseNote } from '../markdown/noteParser.js'

const { DEFAULT_USER_PASSWORD } = config

function readFilesSync(dir) {
  const files = []

  fs.readdirSync(dir).forEach(filename => {
    const { name, ext } = path.parse(filename)
    const filepath = path.resolve(dir, filename)
    const stat = fs.statSync(filepath)

    const isFile = stat.isFile()
    if (isFile) {
      const text = fs.readFileSync(filepath, 'utf8')
      files.push({ filepath, name, ext, text })
    }
  })

  return files
}

const setupNotes = async () => {
  const username = 'defaultUser'
  let defaultUser = await User.findOne({ username })

  if (!defaultUser) {
    const user = new User({
      username,
      passwordHash: DEFAULT_USER_PASSWORD
    })
    defaultUser = await user.save()
  }

  const defaultUserId = defaultUser._id

  if (!defaultUserId) {
    throw new Error('default user doesn\'t exists')
  }
  
  await Note.deleteMany({ userId: defaultUserId })

  const __dirname = path.resolve()
  const files = readFilesSync(path.join(__dirname, 'src/setupNotes/notes'))

  let noteId = 100000

  files.forEach(async (file) => {
    const { name, text } = file

    const note = parseNote({
      title: name,
      text,
      zettelId: `${noteId++}` //getZettelId()
    })

    note.userId = defaultUserId

    await (new Note(note)).save()
  })
}


export default setupNotes