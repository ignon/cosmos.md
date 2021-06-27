import server from './server.js'
import logger from './utils/logger.js'


server.listen().then(({ url }) => {
  logger.info(`Server ready at ${url}`)
})