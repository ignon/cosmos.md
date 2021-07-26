import { GraphQLScalarType } from 'graphql'
import dateFormat from 'dateformat'

export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize: (date) => ( 
    dateFormat(date, 'yyyy-mm-dd:HH-MM')
  ),
  parseValue: (value) => new Date(value),
  parseLiteral: (ast) => ( 
    ast.kind === Kind.INT
      ? new Date(parseInt(ast.value, 10))
      : null
   ),
});