const SessionModel = require('../models/session.model')

module.exports = {
  findByUserId: (req, res) => {
    return SessionModel.find({user_id: req.params.user_id}).sort({_id: 1}).lean()
      .then(documents => {
        return res.status(200).json(documents)
      })
  }
}
