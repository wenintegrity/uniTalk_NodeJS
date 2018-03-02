const router = require('express').Router()
const getCalculation = require('../calculation')
const {check, validationResult} = require('express-validator/check')
const validPostCalc = require('../services/validations.service').validPostCalc(check)
const filterAllInfo = require('../services/filterAllInfo.service')
const Calculations = require('../models/calculation.model')

router.post('/calculations', validPostCalc, (req, res, next) => {
  new Promise((resolve, reject) => {
    validationResult(req).isEmpty() ? resolve()
      : (() => {
        let _error = new Error('Input data have error')
        _error.status = 400
        reject(_error)
      })()
  })
    .then(() => {
      return getCalculation(req.body.data)
        .then((data) => {
          return new Calculations({
            phone_id: req.body.id,
            reqBody: req.body,
            calcData: data
          }).save()
            .then((saveData) => {
              return res.json(saveData.calcData.result)
            })
        })
    })
    .catch(next)
})

router.get('/calculations/last', (req, res, next) => {
  Calculations.findOne().sort({_id: -1})
    .then((doc) => {
      return res.json(doc)
    })
    .catch(next)
})

router.get('/calculations/all_info', (req, res, next) => {
  Calculations.find({})
    .then(docsAll => {
      return filterAllInfo(docsAll)
        .then((docsFiltered) => {
          return res.json(docsFiltered)
        })
    })
    .catch(next)
})

router.get('/calculations/:id', (req, res, next) => {
  Calculations.findById(req.params.id)
    .then((document) => {
      return res.json(document)
    })
    .catch(next)
})

module.exports = router
