// import dotenv from 'dotenv'
// dotenv.config()

const localHostURL = 'http://localhost:4000/graphql'

export const SERVER_URL = process.env.REACT_APP_SERVER_URL || localHostURL
export const DEFAULT_NOTE = 'cosmos'

const config = {
  SERVER_URL,
  DEFAULT_NOTE
}

export default config