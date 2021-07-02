// import session from 'express-session'
import express from 'express'
import cookieParser from 'cookie-parser'
import passport, { jwtAuthMiddleware } from './passport/passport.js'



const app = express()

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


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