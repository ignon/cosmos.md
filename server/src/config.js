import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV
const MONGODB_URI = process.env.MONGODB_URI

const NODE_ENVS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test'
}


export default {
  PORT,
  NODE_ENV,
  NODE_ENVS,
  MONGODB_URI
}