import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT ?? 4000
const NODE_ENV = process.env.NODE_ENV
const MONGODB_URI = process.env.MONGODB_URI
const JWT_TOKEN = process.env.JWT_TOKEN
const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD


const NODE_ENVS = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test'
}


export default {
  PORT,
  NODE_ENV,
  NODE_ENVS,
  MONGODB_URI,
  JWT_TOKEN,
  DEFAULT_USER_PASSWORD
}