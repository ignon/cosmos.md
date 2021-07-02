import _ from 'lodash'
import { makeExecutableSchema, gql } from 'apollo-server'
import noteTypeDefs from './noteTypeDefs.js'
import noteResolvers from './noteResolvers.js'
import authTypeDefs from './authTypeDefs.js'
import authResolvers from './authResolvers.js'

const baseTypeDefs = gql`
  type Mutation
  type Query
`

console.log(_.merge({}, noteResolvers, authResolvers))

const schema = makeExecutableSchema({
  typeDefs: [baseTypeDefs, noteTypeDefs, authTypeDefs],
  resolvers: _.merge({}, noteResolvers, authResolvers)
})

export default schema