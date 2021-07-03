import _ from 'lodash'
import { ApolloServer } from 'apollo-server-express'
import schema from './schema/schema.js'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import createDataloaders from './dataloaders/createDataLoaders.js'
import User from './models/User.js'

let testUser
const { NODE_ENV, NODE_ENVS } = config
const TEST_MODE = (NODE_ENV === NODE_ENVS.TEST);

console.log(NODE_ENV, TEST_MODE)

const url = config.MONGODB_URI

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  autoIndex: NODE_ENV !== NODE_ENVS.PRODUCTION
})
  .then(result => {
    logger.info('connected to MongoDB', url)
  })
  .catch(error => {
    logger.info('error connecting to MongoDB:', error.message)
  });


const getUserId = async ({ userId, body }) => {
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

const server = new ApolloServer({
  schema,
  playground: false,
  introspection: true,
  context: async ({ req={}, res }) => {
    const userId = await getUserId(req)

    return {
      userId,
      loaders: createDataloaders({ userId })
    }
  }
})

export default server