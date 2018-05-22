const constants_2 = require('../data/constants_2')
const mathjs = require('mathjs')

class TremorSpectrum_part_2 {
  constructor (arrFftFreq, arrFreqMagScaleNormalizedData, arrFftMag) {
    this.tables = []
    this.tables.push(this.getTable_1(arrFftFreq, arrFreqMagScaleNormalizedData))
    this.tables.push(this.getTable(0, 4, this.tables[0].ctnt_1_Normalized.arr, this.tables[0].freqMagScaleNormalizedData.arr))
    this.tables.push(this.getTable(0, 7, this.tables[0].ctnt_1_Normalized.arr, this.tables[0].freqMagScaleNormalizedData.arr))
    this.tables.push(this.getTable(0, 11, this.tables[0].ctnt_1_Normalized.arr, this.tables[0].freqMagScaleNormalizedData.arr))

    let arrDiferentialFftMag = this.getarrDiferentialFftMag(arrFftMag)

    this.row = {
      peak_1: arrFftFreq.indexOf(arrFftFreq[arrDiferentialFftMag.indexOf(Math.max.apply(null, arrDiferentialFftMag))])
    }

    this.formant = {f1: this.getFormant_f1(arrFftFreq, arrDiferentialFftMag)}

    this.row.delta_2 = this.row.peak_1 + 20
    this.row.delta_1st_2 = this.row.peak_1 + this.row.delta_2
    let [f2, peak_2] = this.getFormantAndPeak(arrFftFreq, arrDiferentialFftMag, this.row.delta_1st_2, this.row.delta_2)
    this.formant.f2 = f2
    this.row.peak_2 = peak_2

    this.row.delta_3 = this.row.peak_2 + 20
    this.row.delta_1st_3 = this.row.peak_1 + this.row.delta_3
    let [f3, peak_3] = this.getFormantAndPeak(arrFftFreq, arrDiferentialFftMag, this.row.delta_1st_3, this.row.delta_3)
    this.formant.f3 = f3
    this.row.peak_3 = peak_3

    this.row.delta_4 = this.row.peak_3 + 20
    this.row.delta_1st_4 = this.row.peak_1 + this.row.delta_4 + 21
    let [f4, peak_4] = this.getFormantAndPeak(arrFftFreq, arrDiferentialFftMag, this.row.delta_1st_4, this.row.delta_4)
    this.formant.f4 = f4
    this.row.peak_4 = peak_4

    this.formDif = {
      f2_f1: this.formant.f2 - this.formant.f1,
      f3_f2: this.formant.f3 - this.formant.f2,
      f4_f3: this.formant.f4 - this.formant.f3
    }

    this.medianF = mathjs.median(this.formDif.f2_f1, this.formDif.f3_f2, this.formDif.f4_f3)

    this.arrResult = []

    for (let i = 0; i <= 614; i++) {
      let row = {
        id: i,
        arrDiferentialFftMag: arrDiferentialFftMag[i]
      }
      this.tables.forEach((el, index) => {
        for (let key in el) {
          el[key].arr ? row[key + '_' + index] = el[key].arr[i] : null
        }
      })

      this.arrResult.push(row)
    }

    this.tables.forEach((el, index) => {
      for (let key in el) {
        el[key].arr ? delete el[key].arr : null
      }
    })
  }

  getTable_1 (arrFftFreq, arrFreqMagScaleNormalizedData) {
    let result = {
      constants: {arr: constants_2},
      fftFreq: {arr: arrFftFreq.slice(1)},
      freqMagScaleNormalizedData: {arr: arrFreqMagScaleNormalizedData.slice(1)}
    }

    this.getMinCountMax(result.constants)
    this.getMinCountMax(result.fftFreq)
    this.getMinCountMax(result.freqMagScaleNormalizedData)

    result.rectified = {arr: this.getArrCtntDifFFT_MusicHarmoniRectified(result.constants.arr, result.constants.min)}
    this.getMinCountMax(result.rectified)

    result.normalized = {arr: this.getArrCtntDifFFT_MusicHarmoniNormalized(result.rectified.arr, result.rectified.max)}
    this.getMinCountMax(result.normalized)

    result.ctnt_1_Normalized = {arr: this.getArrCtnt_1_DifFFT_MusicHarmoniNormalized(result.normalized.arr)}
    this.getMinCountMax(result.ctnt_1_Normalized)

    result.correlation = this.getCorrelation(result.freqMagScaleNormalizedData.arr.slice(0, 429), result.ctnt_1_Normalized.arr.slice(0, 429))

    return result
  }

  getFormantAndPeak (arrFftFreq, arrDiferentialFftMag, delta_1st, delta) {
    let arrDiferential_slice = arrDiferentialFftMag.slice(delta, delta_1st)
    let arrFftFreq_slice = arrFftFreq.slice(delta, delta_1st)
    let rowMax = arrDiferential_slice.indexOf(Math.max.apply(null, arrDiferential_slice))

    return [
      arrFftFreq_slice[rowMax],
      arrFftFreq.indexOf(arrFftFreq_slice[rowMax])
    ]
  }

  getFormant_f1 (arrFftFreq, arrDiferentialFftMag) {
    return arrFftFreq[arrDiferentialFftMag.indexOf(Math.max.apply(null, arrDiferentialFftMag.slice(1, 430)))]
  }

  getarrDiferentialFftMag (arrFftMag) {
    let arrResult = [null]

    for (let i = 1; i <= arrFftMag.length - 1; i++) {
      if (i !== arrFftMag.length - 1) {
        arrResult.push(arrFftMag[i + 1] - arrFftMag[i])
      } else {
        arrResult.push(-arrFftMag[i])
      }
    }

    return arrResult
  }

  getTable (start, step, arr_1, arr_2) {
    let result = {}

    result.normSmooth = this.getArrAvaregeValues(start, step, arr_1)
    result.smoothNorm = this.getDivisionOfDifferenceValues(result.normSmooth)
    result.dataSmoothed = this.getArrAvaregeValues(start, step, arr_2)
    result.dataSmoothNrm = this.getDivisionOfDifferenceValues(result.dataSmoothed)

    result.correlation = this.getCorrelation(result.smoothNorm.arr.slice(step - 1, 429), result.dataSmoothNrm.arr.slice(step - 1, 429))

    return result
  }

  getCorrelation (arr_1, arr_2) {
    let x = [], y = [], xy = [], x2 = [], y2 = []

    for (let i = 0; i <= arr_2.length - 1; i++) {
      if (arr_2[i] !== null && arr_1[i] !== null) {
        x.push(arr_1[i])
        y.push(arr_2[i])
      }
    }

    for (let i = 0; i <= x.length - 1; i++) {
      x2.push(Math.pow(x[i], 2))
      y2.push(Math.pow(y[i], 2))
      xy.push((x[i] * y[i]))
    }

    let sum = {
      x: mathjs.sum(x),
      y: mathjs.sum(y),
      xy: mathjs.sum(xy),
      x2: mathjs.sum(x2),
      y2: mathjs.sum(y2)
    }

    return (x.length * sum.xy - sum.x * sum.y) /
          Math.sqrt(Math.abs(x.length * sum.x2 - Math.pow(sum.x, 2)) * Math.abs(x.length * sum.y2 - Math.pow(sum.y, 2)))
  }

  getDivisionOfDifferenceValues (obj) {
    let result = {arr: []}

    result.arr = obj.arr.map(element => {
      return element ? (element - obj.min) / (obj.max - obj.min) : null
    })
    this.getMinCountMax(result)

    return result
  }

  getArrAvaregeValues (from, step, arr) {
    let result = {arr: Array(step - 1).fill(null)}

    for (let i = from; result.arr.length < arr.length; i++) {
      result.arr.push(this.getAverageValue(arr.slice(i, i + step)))
    }

    this.getMinCountMax(result)

    return result
  }

  getMinCountMax (obj) {
    obj.min = Math.min.apply(null, obj.arr.filter(val => { return val !== null }))
    obj.count = obj.arr.length
    obj.max = Math.max.apply(null, obj.arr)
  }

  getAverageValue (arr) {
    let result = null
    let index = 0

    for (let i = 0; i <= arr.length - 1; i++) {
      if (arr[i] !== null && arr[i] !== '') {
        result = result + arr[i]
        index++
      }
    }

    return result ? result / index : null
  }

  getArrCtnt_1_DifFFT_MusicHarmoniNormalized (arr) {
    let result = []

    arr.forEach(element => {
      result.push(1 - element)
    })

    return result
  }

  getArrCtntDifFFT_MusicHarmoniNormalized (arr, maxArr) {
    let result = []

    arr.forEach(element => {
      result.push(element / maxArr)
    })

    return result
  }

  getArrCtntDifFFT_MusicHarmoniRectified (arrConstants, minArrConstants) {
    let result = []

    arrConstants.forEach(element => {
      result.push(element - minArrConstants)
    })

    return result
  }
}

module.exports = TremorSpectrum_part_2
