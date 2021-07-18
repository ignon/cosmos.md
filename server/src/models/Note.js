import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import explain from 'mongoose-explain'


// var wikilinkSchema = mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     unique: false
//   },
//   zettelId: {
//     type: String,
//     required: false
//   }
// }, { _id : false });


const title = {
  type: String,
  required: true,
  minlength: 1,
}

const zettelId = {
  type: String,
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
    type: mongoose.Schema.ObjectId,
    required: true
  },
  tags: [String],
  text,
  wikilinks: [String],
  'modified': Date
})

schema.plugin(uniqueValidator)

// schema.index({ userId: 1, title: 'text' }, { unique: 1 })
schema.index({ userId: 1, zettelId: 1 }, { unique: 0 })
schema.index({ userId: 1, noteRef: 1 })
schema.index({ userId: 1, tags: 1})
schema.index({ userId: 1, wikilinks: 1})



// unique: 0 for slightly faster indexing
// schema.index({ userId: 1, zettelId: 1, title: 1 }, { unique: 0 })


// schema.plugin(explain)

schema.set('toJSON', {
  transform: (_obj, json) => {
    delete json._id
    delete json.__v
  }
})


export default mongoose.model('Note', schema)