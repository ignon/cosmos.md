import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const schema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    minlength: 30,
    required: true
  }
})

schema.plugin(uniqueValidator)

const transform = {
  transform: (obj, json) => {
    json.id = obj._id.toString()
    delete json._id
    delete json.__v
    delete json.passwordHash
  }
}

schema.set('toJSON', transform)

const User = mongoose.model('User', schema)
export default User