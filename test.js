const request = require('request')
const json = require('./jsonForTest')
let count = 0

let request_calc = () => {
  return request.post({
    url: 'http://localhost:3007/calculations/5ae6f0e672e3fa0a5c3ed9bb',
    body: json,
    json: true
  }, function (err, res, body) {
    if (!err) {
      console.log(count++)
    } else {
      console.error(err)
    }
  })
}

Promise.all([
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc()
])
