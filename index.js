'use strict'

const cluster = require('cluster')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const compression = require('compression')

const config = require('./config')
const routerCalculation = require('./routers/calculation.route')
const routerSession = require('./routers/session.route')
const routerUser = require('./routers/user.route')
const mongoose = require('mongoose')

mongoose.connect(process.env.NODE_MONGO_URL)
  .then(() => {
    if (cluster.isMaster) {
      let cpuCount = require('os').cpus().length

      for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork()
      }
    } else {
      app.use(compression())
      app.use(bodyParser.json({limit: '2mb'}))

      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        next()
      })

      app.use(routerCalculation)
      app.use(routerSession)
      app.use(routerUser)

      app.use(function (req, res, next) {
        let _error = new Error('Not found!')
        _error.status = 404
        next(_error)
      })

      app.use(function (err, req, res, next) {
        res.status(err.status || 500).json({error: err.message})
        console.error('Error: ' + err + '\n Time: ' + new Date())
      })

      app.listen(config.server.port, function () {
        console.log(`Server run at http://localhost:${config.server.port}`)
      })
    }
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
