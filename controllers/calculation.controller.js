const getCalculation = require('../calculation')
const userAndReqValidation = require('../services/validations.service').userAndReqValidation
const CalculationModel = require('../models/calculation.model')
const SessionModel = require('../models/session.model')

module.exports = {
  calculation: (req, res, next) => {
    return userAndReqValidation(req)
      .then(user => {
        return getCalculation(req.body.data)
          .then(calc => {
            return new CalculationModel({user_id: user._id, req: req.body, res: calc}).save()
          })
          .then(saveCalc => {
            if (!req.params.session_id) {
              return new SessionModel({user_id: user._id, calculations: [saveCalc._id]}).save()
                .then(session => {
                  return res.status(201).json({result: saveCalc.res.result, session_id: session._id, calc_id: saveCalc._id})
                })
            } else {
              return SessionModel.update({_id: req.params.session_id}, {'$push': {'calculations': saveCalc._id}})
                .then(() => {
                  return res.status(201).json({result: saveCalc.res.result, calc_id: saveCalc._id})
                })
            }
          })
      })
      .catch(next)
  },

  addPicture: (req, res, next) => {
    return CalculationModel.update({_id: req.params.calc_id}, {pictures: req.body.pictures})
      .then(() => {
        return res.status(200).send()
      })
      .catch(next)
  },

  addVideo: (req, res, next) => {
    return CalculationModel.update({_id: req.params.calc_id}, {video: req.body.video})
      .then(() => {
        return res.status(200).send()
      })
      .catch(next)
  },

  findById: (req, res, next) => {
    return CalculationModel.findById(req.params.id).lean()
      .then(document => {
        return res.status(200).json(document)
      })
      .catch(next)
  },

  downloadData: (req, res, next) => {
    let data_id = req.params.data_id
    return CalculationModel.findById(req.params.id).select(`req.data.data_${data_id}`).lean()
      .then(document => {
        res.setHeader('Content-disposition', `filename=data_${data_id}.csv; charset=utf-8`)
        res.setHeader('Content-Type', 'text/csv')
        return res.status(200).send(document.req.data[`data_${data_id}`].toString()
          .split(',')
          .join('\n'))
      })
      .catch(next)
  },

  getCalcBySessionId: (req, res, next) => {
    return SessionModel.findById(req.params.session_id).lean()
      .then(session => {
        return CalculationModel.find({'_id': {'$in': session.calculations}}).select('_id email pictures video req.location req.time').lean()
      })
      .then(calculations => {
        return res.status(200).send(calculations)
      })
      .catch(next)
  }
}
