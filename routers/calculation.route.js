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
      return Promise.all([
        getCalculation(req.body.data),
        Calculations.findOne({'phone_id': req.body.id}).sort({_id: 1}).lean()
      ])
        .then(([data, firstData]) => {
          return new Calculations({
            phone_id: req.body.id,
            reqBody: req.body,
            calcData: data
          }).save()
            .then((saveData) => {
              if (firstData) {
                let result = {
                  result_1: Math.round(((saveData.calcData.result.result_1 * 100 / firstData.calcData.result.result_1) - 100) * 100) / 100,
                  result_2: Math.round(((saveData.calcData.result.result_2 * 100 / firstData.calcData.result.result_2) - 100) * 100) / 100
                }
                console.log(`Calculation result_1 = ${saveData.calcData.result.result_1} and result_2 = ${saveData.calcData.result.result_2}`)
                console.log(`First data result_1 = ${saveData.calcData.result.result_1} and result_2 = ${saveData.calcData.result.result_2}`)
                return res.json(result)
              } else {
                return res.status(200).send('First sample saved successfully')
              }
            })
        })
    })
    .catch(next)
})

router.get('/calculations/:phone_id/first', (req, res, next) => {
  Calculations.findOne({'phone_id': req.params.phone_id}).sort({_id: 1})
    .then((doc) => {
      return res.json(doc.calcData.result)
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
