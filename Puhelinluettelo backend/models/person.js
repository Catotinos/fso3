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
  id: Number,
  name: String,
  number: String,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', noteSchema)