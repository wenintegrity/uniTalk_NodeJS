const router = require('express').Router()
const getCalculation = require('../calculation')
const validPostCalc = require('../services/validations.service').validPostCalc()
const dataValidation = require('../services/validations.service').dataValidation
const userValidation = require('../services/validations.service').userValidation
const Calculation = require('../models/calculation.model')
const Session = require('../models/session.model')
const User = require('../models/user.model')

router.post('/auth', validPostCalc, (req, res, next) => {
  Promise.all([
    userValidation(req, false),
    dataValidation(req),
    getCalculation(req.body.data)
  ])
    .then(([user, validation, calculation]) => {
      return new Calculation({email: req.body.email, req: req.body, res: calculation}).save()
    })
    .then(saveCalc => {
      return new User({email: req.body.email, first_calc_id: saveCalc._id}).save()
    })
    .then(() => {
      return res.status(201).send()
    })
    .catch(next)
})

router.post('/calculations/:session_id?', validPostCalc, (req, res, next) => {
  Promise.all([
    userValidation(req, true),
    dataValidation(req),
    getCalculation(req.body.data)
  ])
    .then(([user, validation, calculation]) => {
      return new Calculation({email: req.body.email, req: req.body, res: calculation}).save()
    })
    .then(saveCalc => {
      if (!req.params.session_id) {
        return new Session({email: req.body.email, calculations: [saveCalc._id]}).save()
          .then((session) => {
            return res.status(201).json({result: saveCalc.res.result, session_id: session._id, calc_id: saveCalc._id})
          })
      } else {
        return Session.update({_id: req.params.session_id}, {'$push': {'calculations': saveCalc._id}})
          .then(() => {
            return res.status(201).json({result: saveCalc.res.result, calc_id: saveCalc._id})
          })
      }
    })
    .catch(next)
})

router.post('/calculations/:calc_id/pictures', (req, res, next) => {
  Calculation.update({_id: req.params.calc_id})
    .then(calc => {
      return calc({pictures: req.body.pictures}).save()
    })
    .then(() => {
      return res.status(201).send()
    })
    .catch(next)
})

router.get('/calculations/last', (req, res, next) => {
  Calculation.findOne().sort({_id: 1}).lean()
    .then(document => {
      return res.json(document)
    }).catch(next)
})

router.get('/calculations/:id', (req, res, next) => {
  Calculation.findById(req.params.id).lean()
    .then((document) => {
      return res.json(document)
    })
    .catch(next)
})

router.get('/users/all', (req, res, next) => {
  User.find({}).select('email').lean()
    .then((documents) => {
      return res.json(documents)
    })
    .catch(next)
})

router.get('/users/:email/sessions', (req, res, next) => {
  Session.find({email: req.params.email}).lean()
    .then((documents) => {
      return res.json(documents)
    })
    .catch(next)
})

router.get('/session/:session_id', (req, res, next) => {
  Session.findById(req.params.session_id).lean()
    .then((session) => {
      return Calculation.find({'_id': {'$in': session.calculations}}).select('_id, email pictures req.location req.time').lean()
    })
    .then((calculations) => {
      res.status(200).send(calculations)
    })
    .catch(next)
})

router.get('/session/:session_id/single/:single_id', (req, res, next) => {
  Session.findById(req.params.session_id).lean()
    .then((document) => {
      return res.json(document.calculations[req.params.single_id])
    })
    .catch(next)
})

router.get('/calculations/:id/data/:data_id', (req, res, next) => {
  let data_id = req.params.data_id
  Calculation.findById(req.params.id).select(`reqBody.data.data_${data_id}`).lean()
    .then((document) => {
      res.setHeader('Content-disposition',
        `filename=data_${data_id}.csv; charset=utf-8`)
      res.setHeader('Content-Type', 'text/csv')
      res.send(document.reqBody.data[`data_${data_id}`].toString()
        .split(',')
        .join('\n'))
    })
    .catch(next)
})

module.exports = router
