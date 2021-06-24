import { makeExecutableSchema } from 'apollo-server'
import typeDefs from './typeDefs.js'
import resolvers from './resolvers.js'

const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers
})

export default schema