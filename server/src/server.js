import _ from 'lodash'
import { ApolloServer } from 'apollo-server-express'
import schema from './schema.js'
import mongoose from 'mongoose'
import config from './config.js'
import logger from './utils/logger.js'
import backlinks from './dataloaders/backlinks.js'

const { NODE_ENV, NODE_ENVS } = config

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
  })

const server = new ApolloServer({
  schema,
  playground: false,
  introspection: true,
  context: ({ req={} }) => ({
    userId: req.userId,
    loaders: { backlinks }
  })
})

export default server
