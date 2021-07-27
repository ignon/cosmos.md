import { AuthenticationError } from 'apollo-server-errors'

export const REQUIRE_AUTH = 'REQUIRE_AUTH'

const middlewareCheck = (context, checks) => {
  checks.forEach(check => {
    switch(check) {
    case REQUIRE_AUTH:
      if (!context.userId) {
        throw new Error('User has to be authenticated')
      }
      break
    default:
      throw new Error('Unknown middleware:' , check)
    }
  })
}
export default middlewareCheck

export const requireAuth = (context) => {
  if (!context.userId) {
    throw new AuthenticationError('User not logged in')
  }
}