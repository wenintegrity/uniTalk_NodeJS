const mongoose = require('mongoose')
const Schema = mongoose.Schema

const calculations = new Schema({
  req: {type: Object, required: true},
  res: {type: Object, required: true},
  pictures: {type: Array, required: false},
  video: {type: Array, required: false}
}, {
  timestamps: true
})

module.exports = mongoose.model('Calculations', calculations)
