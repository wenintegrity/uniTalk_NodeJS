const constants_2 = require('../data/constants_2')
const mathjs = require('mathjs')

class TremorSpectrum_part_2 {
  constructor (arrFftFreq, arrFreqMagScaleNormalizedData, arrFftMag) {
    this.table_1 = {
      constants: {arr: constants_2},
      fftFreq: {arr: arrFftFreq.slice(1)},
      freqMagScaleNormalizedData: {arr: arrFreqMagScaleNormalizedData.slice(1)}
    }

    this.getMinCountMax(this.table_1.constants)
    this.getMinCountMax(this.table_1.fftFreq)
    this.getMinCountMax(this.table_1.freqMagScaleNormalizedData)

    this.table_1.rectified = {arr: this.getArrCtntDifFFT_MusicHarmoniRectified(this.table_1.constants.arr, this.table_1.constants.min)}
    this.getMinCountMax(this.table_1.rectified)

    this.table_1.normalized = {arr: this.getArrCtntDifFFT_MusicHarmoniNormalized(this.table_1.rectified.arr, this.table_1.rectified.max)}
    this.getMinCountMax(this.table_1.normalized)

    this.table_1.ctnt_1_Normalized = {arr: this.getArrCtnt_1_DifFFT_MusicHarmoniNormalized(this.table_1.normalized.arr)}
    this.getMinCountMax(this.table_1.ctnt_1_Normalized)

    this.table_2 = this.getTable(0, 4, this.table_1.ctnt_1_Normalized.arr, this.table_1.freqMagScaleNormalizedData.arr)
    this.table_3 = this.getTable(0, 7, this.table_1.ctnt_1_Normalized.arr, this.table_1.freqMagScaleNormalizedData.arr)
    this.table_4 = this.getTable(0, 11, this.table_1.ctnt_1_Normalized.arr, this.table_1.freqMagScaleNormalizedData.arr)

    this.arrDiferentialFftMag = this.getarrDiferentialFftMag(arrFftMag)

    console.log(arrFftFreq[this.arrDiferentialFftMag.indexOf(Math.max.apply(null, this.arrDiferentialFftMag))])
    this.row = {
      peak_1: arrFftFreq.indexOf(arrFftFreq[this.arrDiferentialFftMag.indexOf(Math.max.apply(null, this.arrDiferentialFftMag))])
    }

    this.row.delta_2 = this.row.peak_1 + 20
    this.row.delta_1st_2 = this.row.peak_1 + this.row.delta_2

    let arrFftFreqSlice = arrFftFreq.slice(this.row.delta_2, this.row.delta_1st_2)
    this.row.peak_2 = arrFftFreqSlice[arrFftFreqSlice.indexOf(Math.max.apply(null, arrFftFreqSlice))]

    console.log('')
  }

  getarrDiferentialFftMag (arrFftMag) {
    let arrResult = []

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

    result.rectifiedCorr = result.normSmooth[16] - result.smoothNorm[16] + 1

    result.correlation = this.getCorrelation(result.smoothNorm.arr.slice(step - 1, 429), result.dataSmoothNrm.arr.slice(step - 1, 429))

    return result
  }

  getCorrelation (arr_1, arr_2) {
    let x = [], y = [], xy = [], x2 = [], y2 = []

    for (let i = 0; i <= arr_2.length - 1; i++) {
      if (arr_2[i] !== null) {
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
