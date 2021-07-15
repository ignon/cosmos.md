// import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import passport, { jwtAuthMiddleware } from './passport/passport.js'
import { textToJson, authorizeFromBody } from './middleware/sendBeacon.js'


const app = express()


app.use(cookieParser())
app.use('/graphql', textToJson)
app.use(express.json())
app.use('/graphql', authorizeFromBody)
app.use(express.urlencoded({ extended: true }))


app.use(passport.initialize())
app.use('/graphql', jwtAuthMiddleware)


app.get('/health', (_request, response) => {
  response.send('ok')
})

export default app