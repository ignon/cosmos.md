import server from './server.js'
import logger from './utils/logger.js'
import config from './utils/config.js'
import app from './app.js'


export const startApolloServer = async (port) => {
  await server.start()
  server.applyMiddleware({ app })

  let httpServer;
  await new Promise(resolve =>
    httpServer = app.listen({ port }, resolve)
  )


  logger.info(`Server ready at port ${port}`)

  return { app, server, httpServer }
}

export default startApolloServer