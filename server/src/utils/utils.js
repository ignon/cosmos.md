export const serverExecute = async (query, variables=null) => {
  return await server.executeOperation({
    query,
    variables
  })
}