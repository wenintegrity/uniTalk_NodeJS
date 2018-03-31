const mongoose = require('mongoose')
const Schema = mongoose.Schema

const users = new Schema({
  id: {type: Number, required: true, unique : true},
  first_calc_id: {type: String, required: true}
}, {
  timestamps: true
})

module.exports = mongoose.model('Users', users)
