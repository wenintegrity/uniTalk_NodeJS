const UserModel = require('../models/user.model')

module.exports = {
  getAll: (req, res, next) => {
    return UserModel.find({}).select('_id email').lean()
      .then(users => {
        return res.status(200).json(users)
      })
      .catch(next)
  },

  new: (req, res, next) => {
    return UserModel.findOne({email: req.body.email})
      .then(user => {
        if (user === null) {
          return new UserModel({email: req.body.email}).save()
            .then(() => {
              return res.status(201).send()
            })
        } else {
          return res.status(200).send({message: 'This user already exist'})
        }
      })
      .catch(next)
  }
}
