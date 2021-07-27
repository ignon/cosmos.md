import config from '../utils/config.js'
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

export const jwtAuthMiddleware = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) {
      req.userId = user.id
    }

    next()
  })(req, res, next)
}


export default passport

