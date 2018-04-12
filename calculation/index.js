const Data = require('./Data')
const TremorSpectrum = require('./TremorSpectrum')
const TremorSpectrum_part_2 = require('./TremorSpectrum_part_2')
const TremorNA = require('./TremorNA')
const timeData = require('../data/timeData')
const constants = require('../data/constants')
const headers_TremorSpectrum = require('../data/headers_TremorSpectrum')

let calculation = {}

calculation.getData = (body) => {
  return new Promise((resolve, reject) => {
    let data = {}

    try {
      data.data_1 = new Data(timeData, body.data_1)
      data.data_2 = new Data(timeData, body.data_2)
      data.data_3 = new Data(timeData, body.data_3)

      let ts_1 = data.tremorSpectrum_1 = new TremorSpectrum(data.data_1.arrOutMicM50)
      let ts_2 = data.tremorSpectrum_2 = new TremorSpectrum(data.data_2.arrOutMicM50)
      let ts_3 = data.tremorSpectrum_3 = new TremorSpectrum(data.data_3.arrOutMicM50)

      // data.tremorSpectrum_1_part_2 = new TremorSpectrum_part_2(constants, ts_1.arrFftFreq, ts_1.arrFreqMagScaleNormalizedData)
      // data.tremorSpectrum_2_part_2 = new TremorSpectrum_part_2(constants, ts_2.arrFftFreq, ts_2.arrFreqMagScaleNormalizedData)
      // data.tremorSpectrum_3_part_2 = new TremorSpectrum_part_2(constants, ts_3.arrFftFreq, ts_3.arrFreqMagScaleNormalizedData)

      data.rawSmooth = {
        ts1: ts_1.colSum.raw.avgNotesMusic - ts_1.colSum.smoothed.avgNotesMusic,
        ts2: ts_2.colSum.raw.avgNotesMusic - ts_2.colSum.smoothed.avgNotesMusic,
        ts3: ts_3.colSum.raw.avgNotesMusic - ts_3.colSum.smoothed.avgNotesMusic
      }

      data.headers_tremorSpectrum = headers_TremorSpectrum

      data.tremorNegentropicAlgorithm = []
      data.tremorNegentropicAlgorithm.push(new TremorNA(
        'Variability of Raw FFT Spectrum',
        'RHYTHMIC Spectral (EARTH VIB)',
        'RHYTHMIC Spectral (2H PRE)',
        'RHYTHMIC Spectral (2H AFTER)',
        [ts_1.average.d22_635, ts_2.average.d22_635, ts_3.average.d22_635],
        [ts_1.average.filteredFFTMag, ts_2.average.filteredFFTMag, ts_3.average.filteredFFTMag],
        [
          ts_1.average.filteredFFTMag / (ts_1.average.d22_635 - ts_1.average.filteredFFTMag),
          ts_2.average.filteredFFTMag / (ts_2.average.d22_635 - ts_2.average.filteredFFTMag),
          ts_3.average.filteredFFTMag / (ts_3.average.d22_635 - ts_3.average.filteredFFTMag)
        ]
      ))

      data.tremorNegentropicAlgorithm.push(new TremorNA(
        'Other',
        'Other',
        'Other',
        'Other',
        [ts_1.norm.avgPowerHigherOctaves, ts_2.norm.avgPowerHigherOctaves, ts_3.norm.avgPowerHigherOctaves],
        [ts_1.norm.avgPowerDifScale, ts_2.norm.avgPowerDifScale, ts_3.norm.avgPowerDifScale],
        [ts_1.norm.avgPowerDifDifNo, ts_2.norm.avgPowerDifDifNo, ts_3.norm.avgPowerDifDifNo],
        [ts_1.norm.avgPowerDifDifNoMore_1, ts_2.norm.avgPowerDifDifNoMore_1, ts_3.norm.avgPowerDifDifNoMore_1]
      ))

      // data.result = {
      //   result_1: getResult(0),
      //   result_2: getResult(1)
      // }

      function getResult (index) {
        let arrTna = data.sheet_tremorNegentropicAlgorithm

        return (arrTna[0].result[index] + arrTna[1].result[index] + ((arrTna[2].result_1[index] +
                    arrTna[2].result_2[index]) / 2) + arrTna[5].result[index] + arrTna[6].result[index]) / 5
      }

      resolve(data)
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}

module.exports = calculation.getData
