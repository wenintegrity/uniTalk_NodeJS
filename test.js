const request = require('request')
const json = require('./jsonForTest')
let count = 0

let request_calc = () => {
  return request.post({
    url: 'http://switchmymind.chdev.com.ua:3005/calculations/5ae195c29202ffb099331536',
    body: json,
    json: true
  }, function (err, res, body) {
    if (!err) {
      console.log(body)
    } else {
      console.error(err)
    }
  })
}

Promise.all(
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
  request_calc(),
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
)
