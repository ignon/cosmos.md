import dotenv from 'dotenv'
dotenv.config()

export const SERVER_URL = 'https://cosmos-md.herokuapp.com/graphql' //process.env.REACT_APP_SERVER_URL
export const DEFAULT_NOTE = 'cosmos'

const config = {
  SERVER_URL,
  DEFAULT_NOTE
}

export default config