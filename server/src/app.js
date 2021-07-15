// import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import passport, { jwtAuthMiddleware } from './passport/passport.js'
import { textToJson, authorizeFromBody } from './middleware/sendBeacon.js'
import config from './utils/config.js'

const { NODE_ENV, NODE_ENVS: { DEVELOPMENT } } = config


const app = express()

app.use('/graphql', textToJson)

// app.use(cors())
// app.use('/graphql', (req) => {
  // try {
  //   if (req.headers['Content-Type'] === 'text/html') {
  //     console.log('woooop')
  //     req.headers = 'application/json'
  //   }
  // }
  // catch(e) {
  //   console.log(e)
  // }
// })
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/graphql', authorizeFromBody)

app.use(passport.initialize())
app.use('/graphql', jwtAuthMiddleware)

// app.use(session({
//   secret: config.JWT_TOKEN,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: true
//   }
// }));

app.get('/health', (_request, response) => {
  response.send('ok')
})

export default app