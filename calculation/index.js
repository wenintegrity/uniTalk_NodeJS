const Data = require('./Data')
const TremorSpectrum = require('./TremorSpectrum')
const TremorSpectrum_part_2 = require('./TremorSpectrum_part_2')
const TremorNA = require('./TremorNA')
const timeData = require('../data/timeData')
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

      data.tremorSpectrum_1_part_2 = new TremorSpectrum_part_2(ts_1.arrFftFreq, ts_1.arrFreqMagScaleNormalizedData, ts_1.arrFftMag)
      data.tremorSpectrum_2_part_2 = new TremorSpectrum_part_2(ts_2.arrFftFreq, ts_2.arrFreqMagScaleNormalizedData, ts_2.arrFftMag)
      data.tremorSpectrum_3_part_2 = new TremorSpectrum_part_2(ts_3.arrFftFreq, ts_3.arrFreqMagScaleNormalizedData, ts_3.arrFftMag)

      data.rawSmooth = {
        ts1: ts_1.colSum.raw.sumNotesMusic - ts_1.colSum.smoothed.sumNotesMusic,
        ts2: ts_2.colSum.raw.sumNotesMusic - ts_2.colSum.smoothed.sumNotesMusic,
        ts3: ts_3.colSum.raw.sumNotesMusic - ts_3.colSum.smoothed.sumNotesMusic
      }

      data.headers_tremorSpectrum = headers_TremorSpectrum

      data.tremorNegentropicAlgorithm = []
      data.tremorNegentropicAlgorithm.push(new TremorNA(
        'Variability of Raw FFT Spectrum',
        [ts_1.average.d22_635, ts_2.average.d22_635, ts_3.average.d22_635],
        [ts_1.average.filteredFFTMag, ts_2.average.filteredFFTMag, ts_3.average.filteredFFTMag],
        [
          ts_1.average.filteredFFTMag / (ts_1.average.d22_635 - ts_1.average.filteredFFTMag),
          ts_2.average.filteredFFTMag / (ts_2.average.d22_635 - ts_2.average.filteredFFTMag),
          ts_3.average.filteredFFTMag / (ts_3.average.d22_635 - ts_3.average.filteredFFTMag)
        ]
      ))

      data.tremorNegentropicAlgorithm.push(new TremorNA(
        '7.83Hz & Higher Octaves in FFT Ranges (Normalized Scaled to proximity to 7.83 Hz Eq Temp Musical Notes)',
        [ts_1.norm.avgPowerHigherOctavesRaw, ts_2.norm.avgPowerHigherOctavesRaw, ts_3.norm.avgPowerHigherOctavesRaw],
        [ts_1.norm.avgPowerDifScale, ts_2.norm.avgPowerDifScale, ts_3.norm.avgPowerDifScale],
        [ts_1.normScaled.avgPowerDifDifNo, ts_2.normScaled.avgPowerDifDifNo, ts_3.normScaled.avgPowerDifDifNo],
        [ts_1.norm.avgPowerDifDifNoMore_1, ts_2.norm.avgPowerDifDifNoMore_1, ts_3.norm.avgPowerDifDifNoMore_1]
      ))

      data.tremorNegentropicAlgorithm.push(new TremorNA(
        'Solfeggio Scale In Raw FFT ',
        [ts_1.objSolfg.mixSolft, ts_2.objSolfg.mixSolft, ts_3.objSolfg.mixSolft]
      ))

      data.tremorNegentropicAlgorithm.push(new TremorNA(
        'Single Solfeggio Notes in Raw FFT',
        [ts_1.objSolfg.liberating, ts_2.objSolfg.liberating, ts_3.objSolfg.liberating],
        [ts_1.objSolfg.breakemo, ts_2.objSolfg.breakemo, ts_3.objSolfg.breakemo],
        [ts_1.objSolfg.reprLove, ts_2.objSolfg.reprLove, ts_3.objSolfg.reprLove],
        [ts_1.objSolfg.connect, ts_2.objSolfg.connect, ts_3.objSolfg.connect],
        [ts_1.objSolfg.intuition, ts_2.objSolfg.intuition, ts_3.objSolfg.intuition],
        [ts_1.objSolfg.spirorder, ts_2.objSolfg.spirorder, ts_3.objSolfg.spirorder]
      ))

      data.tremorNegentropicAlgorithm.push(new TremorNA(
        'FFT (7.83 Hz Sampling) Power Raw & Normalized Data',
        [ts_1.allFftData.averagePower, ts_2.allFftData.averagePower, ts_3.allFftData.averagePower],
        [ts_1.allFftData.averagePowerSmth, ts_2.allFftData.averagePowerSmth, ts_3.allFftData.averagePowerSmth]
      ))

      data.tremorNegentropicAlgorithm.push(new TremorNA(
        'Formant 1 &2 shift and Inter F interval (Dif Data)',
        [],
        [],
        []
      ))

      data.tremorNegentropicAlgorithm.push(new TremorNA(
        'TableName',
        [ts_1.musicalHarmonics.OneDivideAverageHarmonicPower, ts_2.musicalHarmonics.OneDivideAverageHarmonicPower, ts_3.musicalHarmonics.OneDivideAverageHarmonicPower],
        [ts_1.musicalHarmonics.noFormantDivideFormantHarmonicPower, ts_2.musicalHarmonics.noFormantDivideFormantHarmonicPower, ts_3.allFftData.averagePowerSmth],
        [
          1 / ts_1.musicalHarmonics.averageFormantMinusAllFftPower,
          1 / ts_2.musicalHarmonics.averageFormantMinusAllFftPower,
          1 / ts_3.musicalHarmonics.averageFormantMinusAllFftPower]
      ))

      data.tremorNegentropicAlgorithm.push(new TremorNA(
        'Summation Harmonic Notes 7.83 Hz Equal Temp Musical Scale',
        [ts_1.totalMusic.raw, ts_2.totalMusic.raw, ts_3.totalMusic.raw],
        [ts_1.totalMusic.smth, ts_2.totalMusic.smth, ts_3.totalMusic.smth]
      ))

      data.tremorNegentropicAlgorithm.push({
        table_name: 'Max/Min Pwr Notes in CUMULATIVE FFT Music FORMANT',
        cells: [
          [
            {line9: {value: ts_3.maxPowerNote}, line10: {value: ts_3.allFftData.raw.maxNote}, title: 'Maximal Power Note Raw Data'},
            {line9: {value: ts_2.maxPowerNote}, line10: {value: ts_2.allFftData.raw.maxNote}, title: 'Maximal Power Note Raw Data'},
            {line9: {value: ts_1.maxPowerNote}, line10: {value: ts_1.allFftData.raw.maxNote}, title: 'Maximal Power Note Raw Data'}
          ],
          [
            {line9: {value: ts_3.minPowerNote}, line10: {value: ts_3.allFftData.raw.minNote}, title: 'Minimal Power Note Raw Data'},
            {line9: {value: ts_2.minPowerNote}, line10: {value: ts_2.allFftData.raw.minNote}, title: 'Minimal Power Note Raw Data'},
            {line9: {value: ts_1.minPowerNote}, line10: {value: ts_1.allFftData.raw.minNote}, title: 'Minimal Power Note Raw Data'}
          ]
        ]
      })

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
