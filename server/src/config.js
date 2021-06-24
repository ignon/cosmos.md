import { config } from 'dotenv'

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

const NODE_ENVS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test'
}

export default {
  PORT,
  NODE_ENV,
  NODE_ENVS
}