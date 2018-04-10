const mongoose = require('mongoose')
const Schema = mongoose.Schema

const users = new Schema({
  email: {type: String, required: true, unique: true}
}, {
  timestamps: true
})

module.exports = mongoose.model('Users', users)
