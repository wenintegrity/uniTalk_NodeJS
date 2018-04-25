const router = require('express').Router()
const SessionController = require('../controllers/session.controller')

router.get('/users/:user_id/sessions', SessionController.findByUserId)

module.exports = router
