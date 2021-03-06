import server from './server.js'
import logger from './utils/logger.js'
import app from './app.js'


export const startApolloServer = async (port) => {
  await server.start()

  const cors = { credentials: 1, origin: '*' }
  server.applyMiddleware({ app, cors })

  let httpServer
  await new Promise(resolve =>
    httpServer = app.listen({ port }, resolve)
  )


  logger.info(`Server ready at port ${port}`)

  return { app, server, httpServer }
}

export default startApolloServer