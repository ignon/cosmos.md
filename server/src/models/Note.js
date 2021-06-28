import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

var wikilinkSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: false
  },
  zettelId: {
    type: String,
    required: false
  }
}, { _id : false });


const title = {
  type: String,
  unique: true,
  required: true,
  minlength: 1,
}

const zettelId = {
  type: String,
  unique: true,
  required: true,
  minlength: 5
}

const text = {
  type: String,
  required: true
}

const schema = new mongoose.Schema({
  title,
  zettelId,
  userId: {
    type: String,
    required: true
  },
  tags: [String],
  text,
  wikilinks: [wikilinkSchema],
})

schema.plugin(uniqueValidator)

schema.set('toJSON', {
  transform: (obj, json) => {
    delete json._id
    delete json.__v

    // for(const link of json.wikilinks) {
    //   delete link._id
    // }
  }
})


export default mongoose.model('Note', schema)