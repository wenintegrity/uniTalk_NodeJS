const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessions = new Schema({
  email: {type: String, required: true},
  calculations: {type: Array, required: true}
}, {
  timestamps: true
})

module.exports = mongoose.model('Sessions', sessions)
