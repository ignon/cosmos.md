import server from './server.js'


server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})