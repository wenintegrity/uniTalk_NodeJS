const request = require('request')
const json = require('./jsonForTest')
let count = 0

let request_calc = () => {
  return request.post({
    url: 'http://localhost:3007/calculations',
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
