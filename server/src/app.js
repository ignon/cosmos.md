import express from 'express'
import session from 'express-session'
import config from './config.js'

const app = express()

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/health', (_request, response) => {
  response.send('ok')
})

export default app