import passport from 'passport'
import passportJWT from 'passport-jwt'
import config from '../config.js'

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_TOKEN
}

const jwtCallback = (jwtPayload, done) => {
  console.log(jwtPayload)

  if (jwtPayload) {
    return done(null, jwtPayload)
  }
  else {
    return done('error', false)
  }

  // return User.findOne({ _id: jwt_payload.sub })
  //   .then(user =>
  //     (user)
  //     ? done(null, user)
  //     : done(null, false)
  //   )
  //   .catch(error =>
  //     done(error, false)
  //   )
}

const myJWTStragety = new JWTStrategy(options, jwtCallback)

passport.use(myJWTStragety)


export default passport