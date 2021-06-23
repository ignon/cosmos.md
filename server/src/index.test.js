const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const { ApolloServer } = require('apollo-server')
const { ALL_NOTES } = require('./queries')

/**
 * There are multiple ways to test backend:
 * 1. Test requests from front end
 * 2. Tests from back end
 * 3. Ingegration tests with front end
 */

let server;

describe('ApolloServer', () => {
  beforeEach(() => {
    server = new ApolloServer({
      typeDefs,
      resolvers
    })
  })

  test('getting notes works', async () => {
    
    const { data } = await server.executeOperation({
      query: ALL_NOTES, // variables: {}
    })
    
    // expect(typeof data.allNotes).toBe('object')
    expect(data.allNotes).toBeInstanceOf(Array)
    expect(data.allNotes.length).toBeGreaterThanOrEqual(2)
  })
})

