const mongoose = require('mongoose')
const Schema = mongoose.Schema

const video = new Schema({
  video: {
    type: Array,
    required: true,
    unique: true,
    default: [
      'https://player.vimeo.com/video/261968916',
      'https://player.vimeo.com/video/261970578',
      'https://player.vimeo.com/video/261970813'
    ]}
}, {
  timestamps: true
})

module.exports = mongoose.model('Video', video)
