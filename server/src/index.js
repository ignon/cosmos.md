import { ApolloServer } from 'apollo-server'
import schema from './schema.js'
import mongoose from 'mongoose'
import config from './config.js'

const url = config.MONGODB_URI

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


const server = new ApolloServer({ schema })

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})