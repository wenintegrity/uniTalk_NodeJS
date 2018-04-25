const router = require('express').Router()
const UserController = require('../controllers/user.controller')

router.get('/users', UserController.getAll)

router.post('/users', UserController.new)

module.exports = router
