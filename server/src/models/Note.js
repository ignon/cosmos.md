import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const title = {
  type: String,
  required: true,
  unique: true,
  minlength: 1
}

const zettelId = {
  type: String,
  required: true,
  unique: true,
  minlength: 5
}

const schema = new mongoose.Schema({
  title,
  zettelId,
  tags: [String],
  zettelId: String,
  tags: [String],
  text: String
  // backlinks: [NoteRef],
  // wikilinks: [{
  //   title,
  //   zettelId
  // }],
})

schema.plugin(uniqueValidator)

schema.set('toJSON', {
  transform: (obj, json) => {
    json.id = obj._id
    delete obj._id
    delete obj.__v
  }
})


export default mongoose.model('Note', schema)