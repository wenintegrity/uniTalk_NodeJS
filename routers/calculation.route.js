const router = require('express').Router()
const validPostCalc = require('../services/validations.service').validPostCalc()
const CalculationController = require('../controllers/calculation.controller')

router.post('/calculations/first', validPostCalc, (req, res, next) => {
  CalculationController.firstCalc(req, res)
    .catch(next)
})

router.post('/calculations/:session_id?', validPostCalc, (req, res, next) => {
  CalculationController.calculation(req, res)
    .catch(next)
})

router.patch('/calculations/:calc_id/pictures', (req, res, next) => {
  CalculationController.addPicture(req, res)
    .catch(next)
})

router.patch('/calculations/:calc_id/video', (req, res, next) => {
  CalculationController.addVideo(req, res)
    .catch(next)
})

router.get('/calculations/:id', (req, res, next) => {
  CalculationController.findById(req, res)
    .catch(next)
})

router.get('/calculations/:id/data/:data_id', (req, res, next) => {
  CalculationController.downloadData(req, res)
    .catch(next)
})

router.get('/sessions/:session_id/calculations', (req, res, next) => {
  CalculationController.getCalcBySessionId(req, res)
    .catch(next)
})

module.exports = router
