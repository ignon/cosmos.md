import User from './models/User.js'
import mongoose from 'mongoose'
import { REGISTER, LOGIN } from './queries.js'
import startApolloServer from './startApolloServer'
import supertest from 'supertest'
// import setupNotes from './setupNotes/setupNotes.js'

let httpServer, server, api

jest.setTimeout(30000)

const executeQuery = async (query, variables) => {
  return await server.executeOperation({ query, variables })
}

beforeAll(async () => {
  const setup = await startApolloServer(3000)
  server = setup.server
  httpServer = setup.httpServer

  api = supertest(httpServer)
  await User.deleteMany({})
  console.log('SETUP NOTES')
  // await setupNotes()
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