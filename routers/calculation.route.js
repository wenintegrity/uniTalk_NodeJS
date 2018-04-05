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
    .then(calculation => {
      return new User({email: req.body.email}).save()
        .then(user => {
          return new Session({user_id: user._id, calculations: [calculation._id]}).save()
        })
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
      return new Calculation({req: req.body, res: calculation}).save()
        .then(calculation => {
          return [calculation, user]
        })
    })
    .then(([calculation, user]) => {
      if (!req.params.session_id) {
        return new Session({user_id: user._id, calculations: [calculation._id]}).save()
          .then((session) => {
            return res.status(201).json({result: calculation.res.result, session_id: session._id, calc_id: calculation._id})
          })
      } else {
        return Session.update({_id: req.params.session_id}, {'$push': {'calculations': calculation._id}})
          .then(() => {
            return res.status(201).json({result: calculation.res.result, calc_id: calculation._id})
          })
      }
    })
    .catch(next)
})

router.patch('/calculations/:calc_id/pictures', (req, res, next) => {
  Calculation.update({_id: req.params.calc_id}, {pictures: req.body.pictures})
    .then(() => {
      return res.status(200).send()
    })
    .catch(next)
})

router.patch('/calculations/:calc_id/video', (req, res, next) => {
  Calculation.update({_id: req.params.calc_id}, {video: req.body.video})
    .then(() => {
      return res.status(200).send()
    })
    .catch(next)
})

router.get('/calculations/last', (req, res, next) => {
  Calculation.findOne().sort({_id: 1}).lean()
    .then(document => {
      return res.status(200).json(document)
    }).catch(next)
})

router.get('/calculations/:id', (req, res, next) => {
  Calculation.findById(req.params.id).lean()
    .then((document) => {
      return res.status(200).json(document)
    })
    .catch(next)
})

router.get('/users/all', (req, res, next) => {
  User.find({}).select('_id email').lean()
    .then((documents) => {
      return res.status(200).json(documents)
    })
    .catch(next)
})

router.get('/users/:user_id/sessions', (req, res, next) => {
  Session.find({user_id: req.params.user_id}).sort({_id: 1}).lean()
    .then((documents) => {
      return res.status(200).json(documents)
    })
    .catch(next)
})

router.get('/sessions/:session_id', (req, res, next) => {
  Session.findById(req.params.session_id).lean()
    .then((session) => {
      return Calculation.find({'_id': {'$in': session.calculations}}).select('_id email pictures video req.location req.time').lean()
    })
    .then((calculations) => {
      return res.status(200).send(calculations)
    })
    .catch(next)
})

router.get('/calculations/:id/data/:data_id', (req, res, next) => {
  let data_id = req.params.data_id
  Calculation.findById(req.params.id).select(`req.data.data_${data_id}`).lean()
    .then((document) => {
      res.setHeader('Content-disposition', `filename=data_${data_id}.csv; charset=utf-8`)
      res.setHeader('Content-Type', 'text/csv')
      return res.status(200).send(document.req.data[`data_${data_id}`].toString()
        .split(',')
        .join('\n'))
    })
    .catch(next)
})

module.exports = router
