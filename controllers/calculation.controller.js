const getCalculation = require('../calculation')
const dataValidation = require('../services/validations.service').dataValidation
const userValidation = require('../services/validations.service').userValidation
const CalculationModel = require('../models/calculation.model')
const SessionModel = require('../models/session.model')

module.exports = {
  firstCalc: (req, res) => {
    return Promise.all([
      userValidation(req, false),
      dataValidation(req),
      getCalculation(req.body.data)
    ])
      .then(([user, validation, calculation]) => {
        return [new CalculationModel({email: req.body.email, req: req.body, res: calculation}).save(), user]
      })
      .then(([calculation, user]) => {
        return new SessionModel({user_id: user._id, calculations: [calculation._id]}).save()
      })
      .then(() => {
        return res.status(201).send()
      })
  },

  calculation: (req, res) => {
    return Promise.all([
      userValidation(req, true),
      dataValidation(req),
      getCalculation(req.body.data)
    ])
      .then(([user, validation, calculation]) => {
        return new CalculationModel({req: req.body, res: calculation}).save()
          .then(calculation => {
            return [calculation, user]
          })
      })
      .then(([calculation, user]) => {
        if (!req.params.session_id) {
          return new SessionModel({user_id: user._id, calculations: [calculation._id]}).save()
            .then(session => {
              return res.status(201).json({result: calculation.res.result, session_id: session._id, calc_id: calculation._id})
            })
        } else {
          return SessionModel.update({_id: req.params.session_id}, {'$push': {'calculations': calculation._id}})
            .then(() => {
              return res.status(201).json({result: calculation.res.result, calc_id: calculation._id})
            })
        }
      })
  },

  addPicture: (req, res) => {
    return CalculationModel.update({_id: req.params.calc_id}, {pictures: req.body.pictures})
      .then(() => {
        return res.status(200).send()
      })
  },

  addVideo: (req, res) => {
    return CalculationModel.update({_id: req.params.calc_id}, {video: req.body.video})
      .then(() => {
        return res.status(200).send()
      })
  },

  findById: (req, res) => {
    return CalculationModel.findById(req.params.id).lean()
      .then(document => {
        return res.status(200).json(document)
      })
  },

  downloadData: (req, res) => {
    let data_id = req.params.data_id
    return CalculationModel.findById(req.params.id).select(`req.data.data_${data_id}`).lean()
      .then(document => {
        res.setHeader('Content-disposition', `filename=data_${data_id}.csv; charset=utf-8`)
        res.setHeader('Content-Type', 'text/csv')
        return res.status(200).send(document.req.data[`data_${data_id}`].toString()
          .split(',')
          .join('\n'))
      })
  },

  getCalcBySessionId: (req, res) => {
    return SessionModel.findById(req.params.session_id).lean()
      .then(session => {
        return CalculationModel.find({'_id': {'$in': session.calculations}}).select('_id email pictures video req.location req.time').lean()
      })
      .then(calculations => {
        return res.status(200).send(calculations)
      })
  }
}
