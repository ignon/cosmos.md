import bcrypt from 'bcrypt'
import config from '../utils/config.js'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AuthenticationError } from 'apollo-server'

const generateToken = ({ username, id }) => {
  const tokenUser = { username, id }
  return jwt.sign(tokenUser, config.JWT_TOKEN, { expiresIn: 60*60 })
}


const resolvers = {
  Mutation: {
    register: async (_, args) => {
      const { username, password } = args

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        passwordHash
      })

      return user.save()
        .then(result => {
          const token = generateToken(user.toJSON())
          return { token }
        })
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


      if (user) {
        const token = generateToken(user)
        return { token }
      }

      return user
    }
  }
}


export default resolvers