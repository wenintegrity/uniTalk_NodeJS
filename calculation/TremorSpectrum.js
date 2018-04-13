const fftLib = require('fft-js')
const fft = fftLib.fft
const complex = require('complex')
const mathjs = require('mathjs')
const constants = require('../data/constants')
const colorsFFTfreq = require('../data/colorsFFTfreq')
const regExpColor = new RegExp('^(\\w{1}#?)\\d{1}$')
const headers_TremorSpectrum = require('../data/headers_TremorSpectrum')

class TremorSpectrum {
  constructor (arrOutMicM50) {
    this.max = {}
    this.min = {}
    this.average = {}
    let arr = {}

    arr.outMicM50 = arrOutMicM50
    arr.fftComplex = fft(arrOutMicM50)
    arr.fftFreq = this.getArrFftFreq()
    arr.fftMag = this.getArrFftMag(arr.fftFreq, arr.fftComplex)
    this.quartileFftMag_22_635 = mathjs.quantileSeq(arr.fftMag.slice(1, 615), 0.75)
    arr.filteredFFTMag = this.getFilteredFFTMag(arr.fftMag, this.quartileFftMag_22_635)
    arr.constants = constants
    this.getFreqMagAndConst(arr, constants, arr.filteredFFTMag)

    this.max.consts = Math.max.apply(null, constants.slice(1, 615))
    this.max.fftMag = Math.max.apply(null, arr.fftMag.slice(1, 615))
    this.max.freqMagInDifMore_1 = Math.max.apply(null, arr.freqMagInDifMore_1.slice(1, 615))
    this.max.freqMagInDifLess_1 = Math.max.apply(null, arr.freqMagInDifLess_1.slice(1, 615))
    this.max.freqMag_NO = Math.max.apply(null, arr.freqMag_NO.slice(1, 615))

    this.average.freqMagInDifMore_1 = this.getAverageValue(arr.freqMagInDifMore_1.slice(1, 615))
    this.average.freqMagInDifLess_1 = this.getAverageValue(arr.freqMagInDifLess_1.slice(1, 615))
    this.average.fftMag = this.getAverageValue(arr.fftMag.slice(1, 615))

    /* ---------------   head file excel №1 ---------------- */
    this.average.d22_635 = this.getAverageValue(arr.fftMag.slice(1))
    this.stanDotClone = this.getStanDotClone(arr.fftMag.slice(1, 615))
    this.divisionAverageValuesFftMag_23_404_405_635 = this.getdivisionAverageValuesFftMag_23_404_405_635(arr.fftMag)
    this.divisionAverageValuesFftMag_23_329_329_635 = this.getdivisionAverageValuesFftMag_23_329_329_635(arr.fftMag)

    this.divisionQuartOnMaxFftMag = this.quartileFftMag_22_635 / this.max.fftMag
    this.division_q3_average = this.quartileFftMag_22_635 / this.average.d22_635
    this.objSolfg = this.getArrSolfeggio(arr.fftMag)

    this.mixVH_Hz_ofEnvir = this.objSolfg.mixSolft / this.getAverageValue(arr.fftMag.slice(360, 461))
    /* ---------------   /head file excel №1 ---------------- */

    this.max.filteredFFTMag = Math.max.apply(null, arr.filteredFFTMag.slice(1))
    this.min.filteredFFTMag = this.getMinValueWithoutNull(arr.filteredFFTMag.slice(1))

    arr.freqMagScaleNormalizedData = this.getFreqMagScaleNormalizedData(arr.filteredFFTMag, this.min.filteredFFTMag, this.max.filteredFFTMag)
    arr.constAbsDifHarmoniNormalLess_1 = this.getArrDivElOnVal(arr.constABSDifHarmoniLess_1, this.max.consts)
    arr.constAbsDifHarmoniNormalMore_1 = this.getArrDivElOnVal(arr.constABSDifHarmoniMore_1, this.max.consts)
    arr.freqMagNormalMore_1 = this.getArrDivElOnVal(arr.freqMagInDifMore_1, this.average.freqMagInDifMore_1)
    arr.freqMagNormalLess_1 = this.getArrDivElOnVal(arr.freqMagInDifLess_1, this.max.freqMagInDifLess_1)
    arr.freqMagInDifLess_12_More_8 = this.getArrDivElOnVal(arr.freqMag_NO, this.max.freqMag_NO)
    arr.freqMagDifDiffLess_1 = this.getFreqMagDiffAnd_NO(arr.freqMagNormalLess_1, arr.constAbsDifHarmoniNormalLess_1)
    arr.freqMagDifDiff_NO = this.getFreqMagDiffAnd_NO(arr.freqMagInDifLess_12_More_8, arr.constAbsDifHarmoniNormalMore_1)

    this.max.freqMagDifDiffLess_1 = Math.max.apply(null, arr.freqMagDifDiffLess_1.slice(3, 615))
    this.max.freqMagDiff_NO = Math.max.apply(null, arr.freqMagDifDiff_NO.slice(3, 615))

    arr.freqMagDifDiffNormal = this.getArrDivElOnVal(arr.freqMagDifDiffLess_1, this.max.freqMagDifDiffLess_1)
    arr.freqMagDifDiffNormal_NO = this.getArrDivElOnVal(arr.freqMagDifDiff_NO, this.max.freqMagDiff_NO)

    this.average.freqMagScaleNormalizedData = this.getAverageValue(arr.freqMagScaleNormalizedData.slice(1, 615))
    this.average.freqMagNormalMore_1 = this.getAverageValue(arr.freqMagNormalMore_1.slice(1, 615))
    this.average.freqMagNormalLess_1 = this.getAverageValue(arr.freqMagNormalLess_1.slice(1, 615))
    this.average.freqMagInDifLess_12_More_8 = this.getAverageValue(arr.freqMagInDifLess_12_More_8.slice(1, 615))
    this.average.freqMagDifDiffNormal = this.getAverageValue(arr.freqMagDifDiffNormal.slice(1, 615))
    this.average.freqMagDifDiffNormal_NO = this.getAverageValue(arr.freqMagDifDiffNormal_NO.slice(1, 615))
    this.average.filteredFFTMag = this.getAverageValue(arr.filteredFFTMag.slice(1, 615))

    /* ---------------   head file excel №2 --------------------- */
    this.norm = {}
    this.norm.avgPowerHigherOctaves = this.getAverageValue([2, 4, 8, 16, 32, 64, 128, 256, 512].map(index => arr.freqMagNormalLess_1[index]))
    this.norm.avgPowerOctNo = this.norm.avgPowerHigherOctaves / this.average.freqMagInDifLess_12_More_8
    this.norm.avgPowerHigherOctavesRaw = this.getAverageValue([2, 4, 8, 16, 32, 64, 128, 256, 512].map(index => arr.filteredFFTMag[index]))
    this.norm.avgPowerDifScale = this.average.freqMagInDifLess_1
    this.norm.avgPowerDifDifNoMore_1 = this.average.freqMagNormalLess_1 / this.average.freqMagNormalMore_1
    this.norm.avgPowerDifDifNo = this.average.freqMagNormalLess_1 / this.average.freqMagInDifLess_12_More_8
    this.norm.avgPowerDifAllScale = this.average.freqMagNormalLess_1 / this.average.freqMagScaleNormalizedData

    this.normScaled = {}
    this.normScaled.avgPowerHigherOctaves = this.getAverageValue([2, 4, 8, 16, 32, 64, 128, 256, 512].map(index => arr.freqMagDifDiffNormal[index]))
    this.normScaled.avgPowerOctNo = this.normScaled.avgPowerHigherOctaves / this.average.freqMagDifDiffNormal_NO
    this.normScaled.avgPowerDifScale = this.average.freqMagDifDiffNormal
    this.normScaled.avgPowerDifDifNo = this.average.freqMagDifDiffNormal / this.average.freqMagDifDiffNormal_NO
    /* ---------------   /head file excel №2 -------------------- */

    /* ---------------- calculation tables after read line ------- */
    this.max.fftMagNormalized = Math.max.apply(null, arr.fftMag.slice(1, 615))

    arr.fftMagNormalized = this.getFftMagNormalized(this.max.fftMagNormalized, arr.fftMag)
    arr.fftMagRawSmoothed = this.getArrFftMagRawSmoothed(arr.fftMag)
    arr.fftMagNormalizedSmoothed = this.getArrFftMagNormalizedSmoothed(arr.fftMagRawSmoothed)

    let colorNote = this.getArrFfftNote(arr.fftFreq, arr.fftMag, arr.fftMagNormalized, arr.fftMagRawSmoothed, arr.fftMagNormalizedSmoothed)
    arr.fftNote = colorNote.arrFftNote
    this.objColors = colorNote.objColors

    this.colSum = {}
    this.colSum.raw = this.getColSum(this.objColors, 'valueFftMag')
    this.colSum.normalized = this.getColSum(this.objColors, 'valueFftNorm')
    this.colSum.smoothed = this.getColSum(this.objColors, 'valueFftMagSmoothed')
    this.colSum.smthNormed = this.getColSum(this.objColors, 'valueFftMagNormalizedSmth')
    this.colSum.smthNorm_1 = this.getArrSumSmthNorm_1(this.colSum.smthNormed)

    this.totalMusic = {}
    this.totalMusic.raw = this.colSum.raw.avgNotesMusic
    this.totalMusic.smth = this.colSum.smthNormed.avgNotesMusic
    this.totalMusic.rawSmth = this.totalMusic.raw - this.totalMusic.smth
    this.totalMusic.stDevRawTM = this.colSum.raw.stDevNotesMusic
    this.totalMusic.stDevSmthTM = this.colSum.smthNormed.stDevNotesMusic

    let lowerAndHigherFreq_1 = this.getLowerAndHigherFreq(arr.fftFreq, arr.fftMag, arr.fftMagNormalized, Math.pow(2, (1 / 12)))
    let lowerAndHigherFreq_2 = this.getLowerAndHigherFreq(arr.fftFreq, arr.fftMag, arr.fftMagNormalized, Math.pow(2, (1 / 11.5)))
    let lowerAndHigherFreq_3 = this.getLowerAndHigherFreq(arr.fftFreq, arr.fftMagNormalizedSmoothed, arr.fftMagNormalizedSmoothed, Math.pow(2, (1 / 12)))

    arr.lowerAndHigherFreq_1 = lowerAndHigherFreq_1.arr
    arr.lowerAndHigherFreq_2 = lowerAndHigherFreq_2.arr
    arr.lowerAndHigherFreq_3 = lowerAndHigherFreq_3.arr

    this.musicalHarmonics = {}
    this.musicalHarmonics.averageHarmonicPower = lowerAndHigherFreq_1.average
    this.musicalHarmonics.averageInHarmonicPower = lowerAndHigherFreq_2.average
    this.musicalHarmonics.harmonikDevideInharmonikPower = lowerAndHigherFreq_1.average / lowerAndHigherFreq_2.average
    this.musicalHarmonics.averageAllFftPower = this.average.fftMag
    this.musicalHarmonics.harmonicDevideAllFftPower = lowerAndHigherFreq_1.average / this.average.fftMag

    this.allFftData = {}
    this.allFftData.maxFrequencyHz = arr.fftFreq[arr.fftMag.indexOf(Math.max.apply(null, arr.fftMag.slice(1)))]
    this.allFftData.maxFrequencySmth = arr.fftFreq[arr.fftMagRawSmoothed.indexOf(Math.max.apply(null, arr.fftMagRawSmoothed))]
    this.allFftData.maxFrequencySmthNr = arr.fftFreq[arr.fftMagNormalizedSmoothed.indexOf(Math.max.apply(null, arr.fftMagNormalizedSmoothed))]
    this.allFftData.powerOfMaxRawFrequency = this.max.fftMag
    this.allFftData.maxPowerSmth = Math.max.apply(null, arr.fftMagRawSmoothed.slice(1))
    this.allFftData.maxPowerSmthNr = Math.max.apply(null, arr.fftMagNormalizedSmoothed.slice(1))
    this.allFftData.averagePower = this.average.fftMag
    this.allFftData.averagePowerSmth = this.getAverageValue(arr.fftMagRawSmoothed.slice(1))
    this.allFftData.averagePowerSmthNr = this.getAverageValue(arr.fftMagNormalizedSmoothed.slice(1))

    let maxAndMinPowerNote = this.getPowerNoteName(this.colSum.raw)
    this.maxPowerNote = maxAndMinPowerNote.max
    this.minPowerNote = maxAndMinPowerNote.min

    this.mainTable = []

    for (let i = 0; i <= 2047; i++) {
      let row = {}

      row.id = i + 1
      headers_TremorSpectrum.forEach(element => {
        if (arr[element.name][i]) {
          row[element.name] = arr[element.name][i]
        }
      })

      this.mainTable.push(row)
    }
  }

  getMinValueWithoutNull (arr) {
    let result = 1

    arr.forEach(element => {
      element != null && result > element ? result = element : null
    })

    return result
  }

  getFreqMagScaleNormalizedData (filteredFFTMag, min, max) {
    let result = [null]

    for (let i = 1; i <= 614; i++) {
      let val = (filteredFFTMag[i] - min) / (max - min)
      result.push(val && val > 0 ? val : null)
    }

    return result
  }

  getFilteredFFTMag (arrFftMag, qartile) {
    let result = [null]

    for (let i = 1; i <= 614; i++) {
      result.push(arrFftMag[i] < (qartile + 0.4 * qartile) ? arrFftMag[i] : null)
    }

    return result
  }

  getPowerNoteName (colSumRaw) {
    let min = colSumRaw.arr[0]
    let max = colSumRaw.arr[0]
    colSumRaw.arr.forEach(element => {
      if (min.value === null || min.value > element.value) {
        min = element
      }
      if (max.value === null || max.value < element.value) {
        max = element
      }
    })

    return {
      max: max.name,
      min: min.name
    }
  }

  getColSum (objColor, valueName) {
    let result = {}
    result.colors = {}
    result.arr = []
    let arrForResult = {}
    let arr = []

    for (let mainColor in objColor) {
      arrForResult[mainColor] = {}

      for (let secondColor in objColor[mainColor]) {
        if (secondColor !== 'countOfPeriod') {
          arrForResult[mainColor][secondColor] = []

          objColor[mainColor][secondColor].forEach(element => {
            arrForResult[mainColor][secondColor].push(element[valueName])
          })
        }
      }
    }

    for (let mainColor in arrForResult) {
      for (let secondColor in arrForResult[mainColor]) {
        result.colors[mainColor] !== undefined ? result.colors[mainColor] += this.getAverageValue(arrForResult[mainColor][secondColor])
          : result.colors[mainColor] = this.getAverageValue(arrForResult[mainColor][secondColor])
      }
    }

    for (let color in result.colors) {
      result.arr.push({
        name: color,
        value: result.colors[color]
      })
      arr.push(result.colors[color])
    }

    result.avgNotesMusic = this.getAverageValue(arr)
    result.stDevNotesMusic = this.getStanDotClone(arr)

    return result
  }

  getArrFfftNote (arr, arrFftMag, arrFftNormalized, arrFftMagSmoothed, arrFftMagNormalizedSmth) {
    let arrFftNote = []
    let objColors = {}

    arr.forEach((elFft, indexEl) => {
      colorsFFTfreq.forEach((elColor, indexCol) => {
        if (elFft >= elColor.moreOrEqually && elFft < elColor.less) {
          arrFftNote.push(elColor.name)
          addColor(elColor, elFft, indexEl)
        } else {
          if (colorsFFTfreq.length - 1 === indexCol && indexEl === arrFftNote.length) {
            arrFftNote.push(null)
          }
        }
      })
    })

    function addColor (elColor, elFft, indexEl) {
      let mainColor = regExpColor.exec(elColor.name)

      mainColor[1] in objColors ? addValue(mainColor[1]) : addNewValue(mainColor[1])

      function addValue (mainColor) {
        elColor.name in objColors[mainColor]
          ? objColors[mainColor][elColor.name].push({
            valueFftFreq: elFft,
            valueFftMag: arrFftMag[indexEl],
            valueFftNorm: arrFftNormalized[indexEl],
            valueFftMagSmoothed: arrFftMagSmoothed[indexEl],
            valueFftMagNormalizedSmth: arrFftMagNormalizedSmth[indexEl]
          })
          : objColors[mainColor][elColor.name] = [{
            valueFftFreq: elFft,
            valueFftMag: arrFftMag[indexEl],
            valueFftNorm: arrFftNormalized[indexEl],
            valueFftMagSmoothed: arrFftMagSmoothed[indexEl],
            valueFftMagNormalizedSmth: arrFftMagNormalizedSmth[indexEl]
          }]

        objColors[mainColor].countOfPeriod++
      }

      function addNewValue (mainColor) {
        objColors[mainColor] = {
          countOfPeriod: 1,
          [elColor.name]: [{
            valueFftFreq: elFft,
            valueFftMag: arrFftMag[indexEl],
            valueFftNorm: arrFftNormalized[indexEl],
            valueFftMagSmoothed: arrFftMagSmoothed[indexEl],
            valueFftMagNormalizedSmth: arrFftMagNormalizedSmth[indexEl]
          }]
        }
      }
    }

    return {
      arrFftNote: arrFftNote,
      objColors: objColors
    }
  }

  getLowerAndHigherFreq (arrFftFreq, arrFftMag, arrFftMagNormalized, constDelta) {
    let arrMag = arrFftMag.slice(1)
    let arrFreq = arrFftFreq.slice(1)
    let arrNorm = arrFftMagNormalized.slice(1)
    let maxFftMag = {
      freq: arrFreq[arrMag.indexOf(Math.max.apply(null, arrMag))],
      power: Math.max.apply(null, arrNorm),
      note: getNote(arrFreq[arrMag.indexOf(Math.max.apply(null, arrMag))])
    }
    let result = {
      arr: [maxFftMag]
    }

    for (let i = 0; result.arr.length < 39;) {
      let freq = result.arr[i].freq / constDelta

      result.arr.unshift({
        freq: freq,
        power: getNearNumber(freq),
        note: getNote(freq)
      })
    }

    for (let i = 38; result.arr.length < 73; i++) {
      let freq = result.arr[i].freq * constDelta

      result.arr.push({
        freq: freq,
        power: getNearNumber(freq),
        note: getNote(freq)
      })
    }

    function getNearNumber (number) {
      for (let i = 0; i <= arrFftFreq.length - 1; i++) {
        if ((arrFftFreq.length - 1) === i) {
          return arrFftMagNormalized[i]
        } else {
          if (arrFftFreq[i] > number) {
            return arrFftMagNormalized[i - 1]
          }
        }
      }
    }

    function getNote (elFft) {
      for (let i = 0; i <= colorsFFTfreq.length - 1; i++) {
        if (elFft >= colorsFFTfreq[i].moreOrEqually && elFft < colorsFFTfreq[i].less) {
          return colorsFFTfreq[i].name
        }
      }
    }

    result.average = (() => {
      let arrForAverage = []

      result.arr.forEach(element => {
        if (element.freq > 118 && element.freq <= 2525) {
          arrForAverage.push(element.power)
        }
      })

      return mathjs.mean(arrForAverage)
    })()

    return result
  }

  getArrSumSmthNorm_1 (smthNorm) {
    let maxSmthNorm = (() => {
      let val = 0

      smthNorm.arr.forEach(element => {
        val >= element.value ? null : val = element.value
      })

      return val
    })()

    let arrResult = []
    let result = {}
    result.arr = []

    smthNorm.arr.forEach((element) => {
      result.arr.push({
        name: element.name,
        value: element.value / maxSmthNorm
      })
      arrResult.push(element.value)
    })

    result.avgNotesMusic = mathjs.mean(arrResult)
    result.stDevNotesMusic = this.getStanDotClone(arrResult)

    return result
  }

  getArrFftMagNormalizedSmoothed (arr) {
    let maxValArr = Math.max.apply(null, arr.slice(7, 615))
    let arrForResult = []

    arr.forEach((element) => {
      if (element !== null) {
        arrForResult.push(element / maxValArr)
      } else {
        arrForResult.push(null)
      }
    })

    return arrForResult
  }

  getArrFftMagRawSmoothed (arrFftMag) {
    let arrForResult = [null, null, null, null, null, null, null]

    for (let i = 1, c = 8; c <= arrFftMag.length; i++, c++) {
      arrForResult.push(this.getAverageValue(arrFftMag.slice(i, c)))
    }

    return arrForResult
  }

  getFftMagNormalized (maxN, arrFftMag) {
    let arrResult = []

    for (let i = 0; i <= arrFftMag.length - 1; i++) {
      arrResult.push(arrFftMag[i] / maxN)
    }

    return arrResult
  }

  getFreqMagDiffAnd_NO (arr_1, arr_2) {
    let arrResult = []

    for (let i = 0; i <= arr_1.length - 1; i++) {
      if (arr_1[i] * (1 - arr_2[i])) {
        arrResult.push(arr_1[i] * (1 - arr_2[i]))
      } else {
        arrResult.push(null)
      }
    }

    return arrResult
  }

  getArrDivElOnVal (arr, val) {
    let arrResult = []

    for (let i = 0; i <= arr.length - 1; i++) {
      if (arr[i] / val && arr[i] !== null) {
        arrResult.push(arr[i] / val)
      } else {
        arrResult.push(null)
      }
    }

    return arrResult
  }

  getArrSolfeggio (arrFftMag) {
    let objResult = {}

    objResult.sideralDay = (arrFftMag[25] + arrFftMag[50] + arrFftMag[199] + arrFftMag[398]) / 4
    objResult.liberating = arrFftMag[101]
    objResult.breakemo = arrFftMag[107]
    objResult.reprLove = arrFftMag[135]
    objResult.connect = arrFftMag[163]
    objResult.intuition = arrFftMag[189]
    objResult.spirorder = arrFftMag[218]
    objResult.mixSolft = (objResult.liberating + objResult.breakemo + objResult.reprLove + objResult.connect + objResult.intuition + objResult.spirorder) / 6

    return objResult
  }

  getdivisionAverageValuesFftMag_23_404_405_635 (arrFftMag) {
    let arrFftMag_23_404 = arrFftMag.slice(2, 384)
    let arrFftMag_405_635 = arrFftMag.slice(384, 615)

    return mathjs.mean(arrFftMag_23_404) / mathjs.mean(arrFftMag_405_635)
  }

  getdivisionAverageValuesFftMag_23_329_329_635 (arrFftMag) {
    let arrFftMag_23_329 = arrFftMag.slice(2, 309)
    let arrFftMag_329_635 = arrFftMag.slice(308, 615)

    return mathjs.mean(arrFftMag_23_329) / mathjs.mean(arrFftMag_329_635)
  }

  getArrFftFreq () {
    let constForArr = 8018 / 2048
    let arrFftFreq = [0, constForArr, constForArr + constForArr]

    for (let i = 3; i <= 615 - 1; i++) {
      arrFftFreq.push(arrFftFreq[i - 1] + constForArr)
    }

    return arrFftFreq
  }

  getArrFftMag (arrFftFreq, arrFftComplex) {
    let arrFftMag = []

    for (let i = 0; i <= 615 - 1; i++) {
      arrFftMag.push(2 / 2048 * new complex(arrFftComplex[i][0], arrFftComplex[i][1]).abs())
    }

    return arrFftMag
  }

  getAverageValue (arr) {
    let result = 0
    let index = 0

    for (let i = 0; i <= arr.length - 1; i++) {
      if (arr[i] !== null && arr[i] !== '') {
        result = result + arr[i]
        index++
      }
    }

    return result / index
  }

  getStanDotClone (arrForResult) {
    let sumX = 0

    for (let i = 0; i <= arrForResult.length - 1; i++) {
      if (!isNaN(arrForResult[i])) {
        sumX += arrForResult[i]
      }
    }

    let meanX = sumX / (arrForResult.length)

    let sumNumerators = 0

    arrForResult.forEach((value) => {
      sumNumerators += Math.pow(value - meanX, 2)
    })

    return Math.sqrt(sumNumerators / (arrForResult.length - 1))
  }

  getFreqMagAndConst (arr, arrConst, arrFilteredFFTMag) {
    arr.freqMagInDifLess_1 = []
    arr.freqMagInDifMore_1 = []

    arr.constABSDifHarmoniLess_1 = []
    arr.constABSDifHarmoniMore_1 = []

    arr.freqMag_NO = []

    for (let i = 0; i <= arrConst.length - 1; i++) {
      if (arrConst[i] >= 1) {
        arr.freqMagInDifMore_1.push(arrFilteredFFTMag[i])
        arr.freqMagInDifLess_1.push(null)

        arr.constABSDifHarmoniMore_1.push(arrConst[i])
        arr.constABSDifHarmoniLess_1.push(null)

        arrConst[i] >= 8 && arrConst[i] <= 12 ? arr.freqMag_NO.push(arrFilteredFFTMag[i]) : arr.freqMag_NO.push(null)
      } else {
        arr.freqMagInDifLess_1.push(arrFilteredFFTMag[i])
        arr.freqMagInDifMore_1.push(null)

        arr.constABSDifHarmoniLess_1.push(arrConst[i])
        arr.constABSDifHarmoniMore_1.push(null)

        arr.freqMag_NO.push(null)
      }
    }
  }
}

module.exports = TremorSpectrum
