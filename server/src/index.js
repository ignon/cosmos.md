import server from './server.js'
import logger from './utils/logger.js'
import config from './config.js'
import app from './app.js'


await server.start()
server.applyMiddleware({ app })

app.listen({ port: config.PORT })

logger.info(`Server ready at port ${config.PORT}`)