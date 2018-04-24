const router = require('express').Router()
const UserController = require('../controllers/user.controller')

router.get('/users', (req, res, next) => {
  UserController.getAll(req, res)
    .catch(next)
})

router.post('/users', (req, res, next) => {
  UserController.new(req, res)
    .catch(next)
})

module.exports = router
