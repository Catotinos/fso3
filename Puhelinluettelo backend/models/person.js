const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  name: {type: String, minlength: 3},
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{5}|\d{2}-\d{6}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', noteSchema)