/* eslint-disable no-undef,handle-callback-err */
'use strict'

process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
const server = 'http://localhost:3005'
const body = require('./bodyForCalculation')

chai.use(chaiHttp)

describe('Calculations', () => {
  //   /calculations
  it('it should POST /calculation', function (done) {
    this.timeout(4000)
    chai.request(server)
      .post('/calculations')
      .send(body)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.result_1.should.be.a('number')
        res.body.result_2.should.be.a('number')
        done()
      })
  })

  it('it should fail POST /calculation, did\'t send id', function (done) {
    this.timeout(4000)
    let newBody = JSON.stringify(body)
    delete JSON.parse(newBody).id
    chai.request(server)
      .post('/calculations')
      .send(JSON.stringify(newBody))
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })

  it('it should fail POST /calculation, did\'t send data_1', function (done) {
    this.timeout(4000)
    let newBody = JSON.stringify(body)
    delete JSON.parse(newBody).data.data_1
    chai.request(server)
      .post('/calculations')
      .send(JSON.stringify(newBody))
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })

  it('it should fail POST /calculation, did\'t send data_2', function (done) {
    this.timeout(4000)
    let newBody = JSON.stringify(body)
    delete JSON.parse(newBody).data.data_2
    chai.request(server)
      .post('/calculations')
      .send(JSON.stringify(newBody))
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })

  it('it should fail POST /calculation, did\'t send data_3', function (done) {
    this.timeout(4000)
    let newBody = JSON.stringify(body)
    delete JSON.parse(newBody).data.data_3
    chai.request(server)
      .post('/calculations')
      .send(JSON.stringify(newBody))
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })

  it('it should fail POST /calculation, did\'t send latitude', function (done) {
    this.timeout(4000)
    let newBody = JSON.stringify(body)
    delete JSON.parse(newBody).location.latitude
    chai.request(server)
      .post('/calculations')
      .send(JSON.stringify(newBody))
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })

  it('it should fail POST /calculation, did\'t send longitude', function (done) {
    this.timeout(4000)
    let newBody = JSON.stringify(body)
    delete JSON.parse(newBody).location.longitude
    chai.request(server)
      .post('/calculations')
      .send(JSON.stringify(newBody))
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })

  it('it should fail POST /calculation, did\'t send location', function (done) {
    this.timeout(4000)
    let newBody = JSON.stringify(body)
    delete JSON.parse(newBody).location
    chai.request(server)
      .post('/calculations')
      .send(JSON.stringify(newBody))
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })

  it('it should fail POST /calculation, did\'t send time', function (done) {
    this.timeout(4000)
    let newBody = JSON.stringify(body)
    delete JSON.parse(newBody).time
    chai.request(server)
      .post('/calculations')
      .send(JSON.stringify(newBody))
      .end((err, res) => {
        res.should.have.status(400)
        done()
      })
  })

  // /calculations/last

  it('it should GET /calculations/last', function (done) {
    chai.request(server)
      .get('/calculations/last')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('calcData')
        res.body.should.have.property('createdAt')
        res.body.should.have.property('phone_id')
        res.body.should.have.property('reqBody')
        res.body.should.have.property('updatedAt')
        res.body.should.have.property('_id')

        res.body.calcData.should.be.a('object')
        res.body.createdAt.should.be.a('string')
        res.body.reqBody.should.be.a('object')
        res.body.updatedAt.should.be.a('string')
        res.body._id.should.be.a('string')

        res.body.calcData.should.have.property('headers_sheet_tremorSpectrum')
        res.body.calcData.should.have.property('rawSmooth')
        res.body.calcData.should.have.property('result')
        res.body.calcData.should.have.property('sheet_data_1')
        res.body.calcData.should.have.property('sheet_data_2')
        res.body.calcData.should.have.property('sheet_data_3')
        res.body.calcData.should.have.property('sheet_tremorNegentropicAlgorithm')
        res.body.calcData.should.have.property('sheet_tremorSpectrum_1')
        res.body.calcData.should.have.property('sheet_tremorSpectrum_2')
        res.body.calcData.should.have.property('sheet_tremorSpectrum_3')
        done()
      })
  })
})
