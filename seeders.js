const mongoose = require('mongoose')
const VideoModel = require('./models/video.model')

mongoose.connect(process.env.NODE_MONGO_URL)
  .then(() => {
    return VideoModel.remove({})
      .then(() => {
        return new VideoModel().save()
      })
      .then(() => {
        return mongoose.connection.close()
      })
      .then(() => {
        console.log('Created new collection video')
      })
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
