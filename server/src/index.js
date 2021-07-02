import config from './config.js'
import startApolloServer from './startApolloServer.js'

const port = config.PORT || 4000
startApolloServer(port)