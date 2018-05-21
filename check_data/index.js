const headers_data = require('./headers_data')
const headers_ts = require('./headers_ts')
const headers_ts_part_2 = require('./headers_ts_part_2')
const sheet_data = require('./sheet_data')
const sheet_ts = require('./sheet_ts')
const sheet_ts_2 = require('./sheet_ts_2')

module.exports = {
  start: (data) => {
    return Promise.all([
      check(
        sheet_data,
        {
          1: data.data_1.arrElements,
          2: data.data_2.arrElements,
          3: data.data_3.arrElements
        },
        headers_data
      ),
      check(
        sheet_ts,
        {
          1: data.tremorSpectrum_1.mainTable,
          2: data.tremorSpectrum_2.mainTable,
          3: data.tremorSpectrum_3.mainTable
        },
        headers_ts
      ),
      check(
        sheet_ts_2,
        {
          1: data.tremorSpectrum_1_part_2.arrResult,
          2: data.tremorSpectrum_2_part_2.arrResult,
          3: data.tremorSpectrum_3_part_2.arrResult
        },
        headers_ts_part_2
      )
    ])
  }
}

function check (excel, calc, headers) {
  return new Promise((resolve, reject) => {
    try {
      [1, 2, 3].forEach(i => {
        calc[i].forEach((el, indexEl) => {
          for (let key in el) {
            let indexHeader = headers.indexOf(key)
            if (indexHeader !== -1 && el[key] != null && excel[i][indexEl][indexHeader] != null) {
              let elCalc = Number(el[key].toFixed(10))
              let elExcel = Number(excel[i][indexEl][indexHeader].toFixed(10))
              if (elCalc !== elExcel) {
                console.log('key: ' + key)
                console.log('indexEl: ' + indexEl)
                console.log(elCalc)
                console.log(elExcel)
              }
            }
          }
        })
      })
      resolve()
    } catch (error) { reject(error) }
  })
}
