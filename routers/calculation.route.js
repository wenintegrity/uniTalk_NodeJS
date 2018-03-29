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
                console.log(`
                Calculation result_1 = ${saveData.calcData.result.result_1} and result_2 = ${saveData.calcData.result.result_2}.  
                First data result_1  = ${firstData.calcData.result.result_1} and result_2 = ${firstData.calcData.result.result_2} 
                Time: ` + new Date())
                let result1 = (saveData.calcData.result.result_1 * 100 / firstData.calcData.result.result_1)
                let result2 = (saveData.calcData.result.result_2 * 100 / firstData.calcData.result.result_2)
                return res.json({
                  result_1: result1 >= 0 ? 100 - result1 : 100 + result1,
                  result_2: result2 >= 0 ? 100 - result2 : 100 + result2
                })
              } else {
                console.log(`First results are ${saveData.calcData.result.result_1} and ${saveData.calcData.result.result_2}`)
                return res.json({
                  result_1: saveData.calcData.result.result_1,
                  result_2: saveData.calcData.result.result_2
                })
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
  Calculations.findOne().sort({_id: -1}).lean()
    .then((doc) => {
      return res.json(doc)
    })
    .catch(next)
})

router.get('/calculations/all_info', (req, res, next) => {
  Calculations.find({}).select('_id phone_id reqBody.location reqBody.time')
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

router.get('/calculations/:id/data/:data_id', (req, res, next) => {
  let data_id = req.params.data_id
  Calculations.findById(req.params.id).select(`reqBody.data.data_${data_id}`).lean()
    .then((document) => {
      res.setHeader('Content-disposition', `filename=data_${data_id}.csv; charset=utf-8`)
      res.setHeader('Content-Type', 'text/csv')
      res.send(document.reqBody.data[`data_${data_id}`].toString().split(',').join('\n'))
    })
    .catch(next)
})

// router.get('/calculations/all_id', (req, res, next) => {
//   Calculations.find({}).distinct('phone_id')
//     .then((document) => {
//       return res.json(document)
//     })
//     .catch(next)
// })
//
// router.get('/calculations/:phone_id/locations', (req, res, next) => {
//   Calculations.find({'phone_id': req.params.phone_id}).select('_id phone_id reqBody.location')
//     .then((documents) => {
//       return res.json(documents)
//     })
//     .catch(next)
// })
//
// router.get('/calculations/:phone_id/times', (req, res, next) => {
//   Calculations.find({'phone_id': req.params.phone_id}).select('_id phone_id reqBody.time')
//     .then((documents) => {
//       return res.json(documents)
//     })
//     .catch(next)
// })

module.exports = router
