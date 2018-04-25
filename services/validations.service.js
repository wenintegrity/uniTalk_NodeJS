const {check, validationResult} = require('express-validator/check')
const User = require('../models/user.model')

module.exports = {
  validPostCalc: () => {
    return [
      check('data.data_1').exists().not().isEmpty().custom(value => {
        return value.length === 2048
      }),
      check('data.data_2').exists().not().isEmpty().custom(value => {
        return value.length === 2048
      }),
      check('data.data_3').exists().not().isEmpty().custom(value => {
        return value.length === 2048
      }),
      check('email').exists().not().isEmpty(),
      check('location.latitude').exists().not().isEmpty(),
      check('location.longitude').exists().not().isEmpty(),
      check('time').exists().not().isEmpty()
    ]
  },

  userAndReqValidation: (req) => {
    return new Promise((resolve, reject) => {
      validationResult(req).isEmpty() ? resolve()
        : (() => {
          let _error = new Error('Input data have error')
          _error.status = 400
          reject(_error)
        })()
    }).then(() => {
      return User.findOne({email: req.body.email}).lean()
        .then(user => {
          if (user === null) {
            let _error = new Error('User with this email didn\'t find')
            _error.status = 400
            throw _error
          } else {
            return user
          }
        })
    })
  }
}
