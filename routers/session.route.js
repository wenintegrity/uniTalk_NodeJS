const router = require('express').Router()
const SessionController = require('../controllers/session.controller')

router.get('/users/:user_id/sessions', (req, res, next) => {
  SessionController.findByUserId(req, res)
    .catch(next)
})

module.exports = router
