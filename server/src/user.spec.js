import User from './models/User.js'
import mongoose from 'mongoose'
import { REGISTER, LOGIN } from './queries.js'
import startApolloServer from './startApolloServer'
import supertest from 'supertest'

let httpServer, server, api;

const executeQuery = async (query, variables) => {
  return await server.executeOperation({ query, variables })
}

beforeAll(async () => {
  const apolloServer = await startApolloServer(3000)
  server = apolloServer.server
  httpServer = apolloServer.httpServer

  api = supertest(httpServer)

  await User.deleteMany({})
})

describe('basics', () => {
  test('creating user', async () => {
    const user = {
      username: 'arde',
      password: 'kissa3'
    }

    const result = await executeQuery(REGISTER, user)

    const { token } = result.data.register
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
  })
  
  test('creating user without password fails', async () => {
    const user = { username: 'arde' }

    const result = await executeQuery(REGISTER, user)
    expect(result.errors[0].message).toMatch(/Variable.*?was not provided/i)
  })

  test('login works', async () => {
    const user = { username: 'konna', password: 'kissa3' }
    await executeQuery(REGISTER, user)

    const result = await executeQuery(LOGIN, user)
    const token = result.data.login.token

    expect(typeof token).toBe('string')

    const requestNoAuth = await api
      .get('/graphql?query={allNotes{title}}')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const errorMessage = requestNoAuth.body.errors[0].message
    expect(errorMessage).toMatch(/not logged in/)

    const requestWithAuth = await api
      .get('/graphql?query={allNotes{title}}')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const notes = requestWithAuth.body.data.allNotes
    expect(notes).toEqual([])
  })
})


afterAll(() => {
  mongoose.connection.close()
  httpServer.close()
})