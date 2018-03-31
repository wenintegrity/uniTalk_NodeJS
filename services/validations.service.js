const {check, validationResult} = require('express-validator/check')
const User = require('../models/user.model')

module.exports = {
  validPostCalc: () => {
    return [
      check('data.data_1')
        .exists()
        .not().isEmpty()
        .custom(value => {
          return value.length === 2048
        }),
      check('data.data_2')
        .exists()
        .not().isEmpty()
        .custom(value => {
          return value.length === 2048
        }),
      check('data.data_3')
        .exists()
        .not().isEmpty()
        .custom(value => {
          return value.length === 2048
        }),
      check('user_id')
        .exists()
        .not().isEmpty(),
      check('location.latitude')
        .exists()
        .not().isEmpty(),
      check('location.longitude')
        .exists()
        .not().isEmpty(),
      check('time')
        .exists()
        .not().isEmpty()
    ]
  },

  dataValidation: (req) => {
    return new Promise((resolve, reject) => {
      validationResult(req).isEmpty() ? resolve()
        : (() => {
          let _error = new Error('Input data have error')
          _error.status = 400
          reject(_error)
        })()
    })
  },

  userValidation: (req, userIs) => {
    return new Promise((resolve, reject) => {
      User.findOne({id: req.body.user_id})
        .then(user => {
          if (userIs && user === null) {
            let _error = new Error('User with this id didn\'t find')
            _error.status = 400
            reject(_error)
          } else {
            if (!userIs && user !== null) {
              let _error = new Error('User with this id already exist')
              _error.status = 400
              reject(_error)
            } else {
              resolve()
            }
          }
        })
    })
  }
}
