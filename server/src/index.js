import config from './utils/config.js'
import startApolloServer from './startApolloServer.js'

const port = config.PORT || 4000
startApolloServer(port)