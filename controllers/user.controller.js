const UserModel = require('../models/user.model')

module.exports = {
  getAll: (req, res) => {
    return UserModel.find({}).select('_id email').lean()
      .then(users => {
        return res.status(200).json(users)
      })
  },

  new: (req, res) => {
    return new UserModel({email: req.body.email}).save()
      .then(() => {
        return res.status(201).send()
      })
  }
}
