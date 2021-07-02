// import session from 'express-session'
import express from 'express'
import config from './utils/config.js'
import cookieParser from 'cookie-parser'

import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'

const options = {
  secretOrKey: config.JWT_TOKEN,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // issuer: 'arde.arde.com', audience: 'create.md'
}

const myJWTStrategy = new JWTStrategy(options, async (payload, done) => {
  const { id, username } = payload

  if (id && username) {
    const user = { id, username }
    return done(null, user)
  }

  return done(null, false)
})


passport.use('jwt', myJWTStrategy)
passport.initialize()


const app = express()

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use('/graphql', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (user) {
      req.userId = user.id
    }

    next()
  })(req, res, next)
})

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