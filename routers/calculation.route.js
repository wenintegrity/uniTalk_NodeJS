const router = require('express').Router()
const getCalculation = require('../calculation')
const validPostCalc = require('../services/validations.service').validPostCalc()
const resultValidation = require('../services/validations.service').resultValidation
const Calculation = require('../models/calculation.model')
const Session = require('../models/session.model')
const User = require('../models/user.model')

router.post('/auth', validPostCalc, (req, res, next) => {
  Promise.all([resultValidation(req), getCalculation(req.body.data)])
    .then(([validation, calculation]) => {
      return new Calculation({user_id: req.body.user_id, req: req.body, res: calculation}).save()
        .then(saveCalc => {
          return new User({id: req.body.user_id, first_calc_id: saveCalc._id}).save()
            .then(() => {
              return res.status(201).send()
            })
        })
    })
    .catch(next)
})

router.post('/calculations/:session_id?', validPostCalc, (req, res, next) => {
  Promise.all([
    new Promise((resolve, reject) => { User.findOne({id: req.body.user_id}).then(user => { user == null ? reject() : resolve() }) }),
    resultValidation(req),
    getCalculation(req.body.data)
  ])
    .then(([user, validation, calculation]) => {
      return new Calculation({user_id: req.body.user_id, req: req.body, res: calculation}).save()
        .then(saveCalc => {
          if (!req.params.session_id) {
            return new Session({user_id: req.body.user_id, calculations: [saveCalc._id]}).save()
              .then((session) => {
                return res.status(201).json({result: calculation.result, session_id: saveCalc._id})
              })
          } else {
            return Session.update({_id: req.params.session_id}, {'$push': {'calculations': saveCalc._id}})
              .then(() => {
                return res.status(201).json({result: calculation.result})
              })
          }
        })
    })
    .catch(next)
})

router.post('/calculations/:calc_id/picture', (req, res, next) => {
  Calculation.update({_id: req.params.calc_id}, {'$push': {'pictures': req.body.pictures}})
    .then(() => {
      return res.status(201).send()
    })
    .catch(next)
})

router.get('/calculations/:id', (req, res, next) => {
  Calculation.findById(req.params.id).lean()
    .then((document) => {
      return res.json(document)
    })
    .catch(next)
})

router.get('/users/all', (req, res, next) => {
  User.find({}).select('id').lean()
    .then((documents) => {
      return res.json(documents)
    })
    .catch(next)
})

router.get('/users/:user_id/sessions', (req, res, next) => {
  Session.find({user_id: req.params.user_id}).lean()
    .then((documents) => {
      return res.json(documents)
    })
    .catch(next)
})

router.get('/session/:session_id', (req, res, next) => {
  Session.findById(req.params.session_id).lean()
    .then((document) => {
      return res.json(document)
    })
    .catch(next)
})

router.get('/session/:session_id/single/single_id', (req, res, next) => {
  Session.findById(req.params.session_id).lean()
    .then((document) => {
      return res.json(document.calculations[req.params.single_id])
    })
    .catch(next)
})

// router.get('/calculations/:user_id/first', (req, res, next) => {
//   Calculation.findOne({'user_id': req.params.user_id})
//     .sort({_id: 1})
//     .then((doc) => {
//       return res.json(doc.calcData.result)
//     })
//     .catch(next)
// })
//
// router.get('/calculations/last', (req, res, next) => {
//   Calculation.findOne().sort({_id: -1}).lean().then((doc) => {
//     return res.json(doc)
//   }).catch(next)
// })
//
// router.get('/calculations/all_info', (req, res, next) => {
//   Calculation.find({})
//     .select('_id user_id reqBody.location reqBody.time')
//     .then(docsAll => {
//       return filterAllInfo(docsAll).then((docsFiltered) => {
//         return res.json(docsFiltered)
//       })
//     })
//     .catch(next)
// })
//
// router.get('/calculations/:id/data/:data_id', (req, res, next) => {
//   let data_id = req.params.data_id
//   Calculation.findById(req.params.id)
//     .select(`reqBody.data.data_${data_id}`)
//     .lean()
//     .then((document) => {
//       res.setHeader('Content-disposition',
//         `filename=data_${data_id}.csv; charset=utf-8`)
//       res.setHeader('Content-Type', 'text/csv')
//       res.send(document.reqBody.data[`data_${data_id}`].toString()
//         .split(',')
//         .join('\n'))
//     })
//     .catch(next)
// })
//
// router.get('/calculations/:user_id/sessions', (req, res, next) => {
//   Calculation.find({'user_id': req.params.user_id})
//     .select('_id phone_id reqBody.location')
//     .then((documents) => {
//       return res.json(documents)
//     })
//     .catch(next)
// })

module.exports = router
