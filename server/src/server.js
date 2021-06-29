import _ from 'lodash'
import { ApolloServer } from 'apollo-server'
import schema from './schema.js'
import mongoose from 'mongoose'
import config from './config.js'
import logger from './utils/logger.js'
import DataLoader from 'dataloader'
import Note from './models/Note.js'

const { NODE_ENV, NODE_ENVS } = config


const url = config.MONGODB_URI

// const MyApolloServer = () => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    autoIndex: NODE_ENV !== NODE_ENVS.PRODUCTION
  })
    .then(result => {
      logger.info('connected to MongoDB', url)
    })
    .catch(error => {
      logger.info('error connecting to MongoDB:', error.message)
    })

  const server = new ApolloServer({
    schema,
    playground: (config.NODE_ENV === 'development'),
    introspection: true,
    context: {
      loaders: {
        backlinks: new DataLoader(async (titles) => {

          console.log(titles)

          const backlinkMap = {}
          
          titles.forEach(t =>
            backlinkMap[t] = []
          )
            
          const backlinkNotes = await Note.find({
            $and: [
              { userId: 'arde' },
              { wikilinks: { $in: titles } }
            ]
          }).select('title wikilinks zettelId -_id')
            
            
          console.log('TITLES', titles)
          console.log('BACKLINK NOTES', backlinkNotes)

          backlinkNotes.forEach(note => {
            note.wikilinks.forEach(wikilink => {
              if (backlinkMap[wikilink]) {
                backlinkMap[wikilink].push(note)
              }
            })
          })

          const backlinks = titles.map(title => backlinkMap[title]) 
          return backlinks
        })
      }
    }
  })

export default server
