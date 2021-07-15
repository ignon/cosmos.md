import config from '../utils/config.js'
const { NODE_ENV, NODE_ENVS: { DEVELOPMENT } } = config

export const textToJson = ({ headers }, res, next) => {
  if (headers['content-type'] === 'text/plain') {
    headers['content-type'] = 'application/json'
  }
  next()
}

const isDevMode = NODE_ENV === DEVELOPMENT

export const authorizeFromBody = (req, _res, next) => {
  const { protocol, body, headers } = req

  if (!body.authorization) {
    return next()
  }


  const isLocalhost = req.get('host').includes('localhost')
  
  if (protocol === 'https' || (isDevMode && isLocalhost)) {
    headers.authorization = body.authorization
    delete body.authorization
  }


  next()
}