import { ApolloServer } from 'apollo-server-express'
import schema from './schema/schema.js'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import createDataloaders from './dataloaders/createDataLoaders.js'
import User from './models/User.js'
import setupNotes from './setupNotes/setupNotes.js'

let testUser, defaultUser

const { NODE_ENV, NODE_ENVS } = config
const TEST_MODE = (NODE_ENV === NODE_ENVS.TEST)

const url = config.MONGODB_URI

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  autoIndex: NODE_ENV !== NODE_ENVS.PRODUCTION
})
  .then(() => {
    logger.info('connected to MongoDB', url)
    setupNotes()
  })
  .catch(error => {
    logger.info('error connecting to MongoDB:', error.message)
  })


const getUserId = async ({ userId }) => {
  if (userId) return userId
  if (TEST_MODE) {
    if (!testUser) {
      testUser = (await User.find({ username: 'TestUser' }))[0]
    }
    if (testUser) {
      return testUser._id
    }
  }

  return null
}

const getDefaultUserId = async () => {
  if (!defaultUser) {
    defaultUser = await User.findOne({ username: 'defaultUser' })
  }
  if (!defaultUser) {
    throw new Error('defaultUser not set')
  }

  return defaultUser._id
}

const server = new ApolloServer({
  schema,
  playground: false,
  introspection: true,
  context: async ({ req={}}) => {
    const userId = await getUserId(req)
    const defaultUserId = await getDefaultUserId()
    const userOrDefaultId = userId || defaultUserId

    console.log({ userId })


    return {
      userId,
      defaultUserId,
      userOrDefaultId,
      loaders: createDataloaders({ userId: userOrDefaultId })
    }
  }
})

export default server