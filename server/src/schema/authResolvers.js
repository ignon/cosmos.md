import bcrypt from 'bcrypt'
import config from '../utils/config.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AuthenticationError } from 'apollo-server'
import Note from '../models/Note.js'

const generateToken = ({ username, _id: id }) => {
  const tokenUser = { username, id }
  return jwt.sign(tokenUser, config.JWT_TOKEN, { expiresIn: 60*60 })
}


const resolvers = {
  Mutation: {
    register: async (_, args, ctx) => {
      const { username, password } = args

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        recentNotes: [],
        passwordHash
      })

      const defaultNotes = await Note.find({ userId: ctx.defaultUserId })
      await user.save()

      for(const note of defaultNotes) {
        const newNote = new Note({ ...note.toJSON(), userId: user._id })
        await newNote.save()
      }

      const token = generateToken(user)
      return { token }
    },
    login: async (_, args) => {
      const { username, password } = args
      const user = await User.findOne({ username })

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)


      if (!user || !passwordCorrect) {
        throw new AuthenticationError('Invalid username or password')
      }

      const token = generateToken(user)
      return { token }
    }
  }
}


export default resolvers