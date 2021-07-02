import { gql } from 'apollo-server'


const typeDefs = gql`
  type Token {
    token: String!
  }

  extend type Mutation {
    register(
      username: String!
      password: String!
    ): Token

    login(
      username: String!
      password: String!
    ): Token
  }
`

export default typeDefs