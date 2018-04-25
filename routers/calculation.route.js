const router = require('express').Router()
const validPostCalc = require('../services/validations.service').validPostCalc()
const CalculationController = require('../controllers/calculation.controller')

router.post('/calculations/first', validPostCalc, CalculationController.firstCalc)

router.post('/calculations/:session_id?', validPostCalc, CalculationController.calculation)

router.patch('/calculations/:calc_id/pictures', CalculationController.addPicture)

router.patch('/calculations/:calc_id/video', CalculationController.addVideo)

router.get('/calculations/:id', CalculationController.findById)

router.get('/calculations/:id/data/:data_id', CalculationController.downloadData)

router.get('/sessions/:session_id/calculations', CalculationController.getCalcBySessionId)

module.exports = router
