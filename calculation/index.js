const Data = require('./Data')
const TremorSpectrum = require('./TremorSpectrum')
const TremorSpectrum_part_2 = require('./TremorSpectrum_part_2')
const tremorSpectrum_part_3 = require('./TremorSpectrum_part_3')
const TremorNA = require('./TremorNA')
const timeData = require('../data/timeData')
const headers_TremorSpectrum = require('../data/headers_TremorSpectrum')
const headers_TremorSpectrum_part_2 = require('../data/headers_TremorSpectrum_part_2')

let calculation = {}

calculation.getData = (body) => {
  const data = [1, 2, 3].map(i => new Data(timeData, body[`data_${i}`]))

  return Promise.all(data.map(data_i => data_i.generate()))
    .then(([data_1, data_2, data_3]) => {
      return {data_1: data_1, data_2: data_2, data_3: data_3}
    })
    .then(data => {
      const tremorS = [1, 2, 3].map(i => new TremorSpectrum(data[`data_${i}`].arrOutMicM50))
      return Promise.all(tremorS.map(ts_i => ts_i.generate()))
        .then(([ts_1, ts_2, ts_3]) => {
          data.tremorSpectrum_1 = ts_1
          data.tremorSpectrum_2 = ts_2
          data.tremorSpectrum_3 = ts_3

          return data
        })
    })
    .then(data => {
      const tremorS_part_2 = [1, 2, 3].map(i => new TremorSpectrum_part_2(
        data[`tremorSpectrum_${i}`].arrFftFreq,
        data[`tremorSpectrum_${i}`].arrFreqMagScaleNormalizedData,
        data[`tremorSpectrum_${i}`].arrFftMag
      ))
      return Promise.all(tremorS_part_2.map(ts_i_2 => ts_i_2.generate()))
        .then(([ts_1_2, ts_2_2, ts_3_2]) => {
          data.tremorSpectrum_1_part_2 = ts_1_2
          data.tremorSpectrum_2_part_2 = ts_2_2
          data.tremorSpectrum_3_part_2 = ts_3_2

          tremorSpectrum_part_3(ts_1_2, ts_2_2, ts_3_2)
          data.headers_tremorSpectrum = headers_TremorSpectrum
          data.headers_tremorSpectrum_part_2 = headers_TremorSpectrum_part_2

          let ts_1 = data.tremorSpectrum_1
          let ts_2 = data.tremorSpectrum_2
          let ts_3 = data.tremorSpectrum_3

          data.tremorNegentropicAlgorithm = []
          data.tremorNegentropicAlgorithm.push(new TremorNA(
            'Variability of Raw FFT Spectrum',
            [ts_1.average.d22_635, ts_2.average.d22_635, ts_3.average.d22_635, 'Average Spectrum'],
            [ts_1.average.filteredFFTMag, ts_2.average.filteredFFTMag, ts_3.average.filteredFFTMag, 'Average Filtered (NO FORMANT) Spectrum'],
            [
              ts_1.average.filteredFFTMag / (ts_1.average.d22_635 - ts_1.average.filteredFFTMag),
              ts_2.average.filteredFFTMag / (ts_2.average.d22_635 - ts_2.average.filteredFFTMag),
              ts_3.average.filteredFFTMag / (ts_3.average.d22_635 - ts_3.average.filteredFFTMag),
              'NO FORMANT/ FORMANT) Avg Filter Spectrum'
            ]
          ))

          data.tremorNegentropicAlgorithm.push(new TremorNA(
            '7.83Hz & Higher Octaves in FFT Ranges (Normalized Scaled to proximity to 7.83 Hz Eq Temp Musical Notes)',
            [ts_1.norm.avgPowerHigherOctavesRaw, ts_2.norm.avgPowerHigherOctavesRaw, ts_3.norm.avgPowerHigherOctavesRaw, 'Power 7.83Hz & HiOct  Raw'],
            [ts_1.norm.avgPowerDifScale, ts_2.norm.avgPowerDifScale, ts_3.norm.avgPowerDifScale, 'Power<1 Dif 7.83Hz NormScaled'],
            [ts_1.normScaled.avgPowerDifDifNo, ts_2.normScaled.avgPowerDifDifNo, ts_3.normScaled.avgPowerDifDifNo, 'Power<1 Dif 7.83Hz/ 8-12 DifNO 7.83Hz NormScaled'],
            [ts_1.norm.avgPowerDifDifNoMore_1, ts_2.norm.avgPowerDifDifNoMore_1, ts_3.norm.avgPowerDifDifNoMore_1, 'Power <1Dif 7.83/  >1 Dif No7.83 Hz NormUnscaled']
          ))

          data.tremorNegentropicAlgorithm.push(new TremorNA(
            'Solfeggio Scale In Raw FFT ',
            [ts_1.objSolfg.mixSolft, ts_2.objSolfg.mixSolft, ts_3.objSolfg.mixSolft, 'Power Mix  Solfg VHz']
          ))

          data.tremorNegentropicAlgorithm.push(new TremorNA(
            'Single Solfeggio Notes in Raw FFT',
            [ts_1.objSolfg.liberating, ts_2.objSolfg.liberating, ts_3.objSolfg.liberating, 'Solfeggio  V 396Hz LIBER'],
            [ts_1.objSolfg.breakemo, ts_2.objSolfg.breakemo, ts_3.objSolfg.breakemo, 'Solfeggio  V 417Hz BREAK'],
            [ts_1.objSolfg.reprLove, ts_2.objSolfg.reprLove, ts_3.objSolfg.reprLove, 'Solfeggio  V 528Hz DNAR'],
            [ts_1.objSolfg.connect, ts_2.objSolfg.connect, ts_3.objSolfg.connect, 'Solfeggio  V 639Hz CONCT'],
            [ts_1.objSolfg.intuition, ts_2.objSolfg.intuition, ts_3.objSolfg.intuition, 'Solfeggio  V 741Hz INTUIT'],
            [ts_1.objSolfg.spirorder, ts_2.objSolfg.spirorder, ts_3.objSolfg.spirorder, 'Solfeggio  V 852Hz SPIROR']
          ))

          data.tremorNegentropicAlgorithm.push(new TremorNA(
            'FFT (7.83 Hz Sampling) Power Raw & Normalized Data',
            [ts_1.allFftData.raw.averagePower, ts_2.allFftData.raw.averagePower, ts_3.allFftData.raw.averagePower, 'Average Power All FFT Note Raw Data'],
            [ts_1.allFftData.smth.averagePower, ts_2.allFftData.smth.averagePower, ts_3.allFftData.smth.averagePower, 'Avg Power All FFT Smth Data']
          ))

          data.tremorNegentropicAlgorithm.push(new TremorNA(
            'Formant 1 &2 shift and Inter F interval (Dif Data)',
            [ts_1_2.formant.f1, ts_2_2.formant.f1, ts_3_2.formant.f1, 'Frequency Hz FORMANT 1 Dif Raw Data'],
            [ts_1_2.formant.f2, ts_2_2.formant.f2, ts_3_2.formant.f2, 'Frequency Hz FORMANT 2 Dif Raw Data']
          // [ts_1_2.medianF, ts_3_2.medianF, ts_3_2.medianF, 'Inter Formant Frequency Dif Raw Data']
          ))

          data.tremorNegentropicAlgorithm.push(new TremorNA(
            'TableName',
            [
              ts_1.musicalHarmonics.OneDivideAverageHarmonicPower,
              ts_2.musicalHarmonics.OneDivideAverageHarmonicPower,
              ts_3.musicalHarmonics.OneDivideAverageHarmonicPower,
              '1/Average FORMANT Harmonic Power'
            ],
            [
              ts_1.musicalHarmonics.noFormantDivideFormantHarmonicPower,
              ts_2.musicalHarmonics.noFormantDivideFormantHarmonicPower,
              ts_3.musicalHarmonics.noFormantDivideFormantHarmonicPower,
              'NO FORMANT 7.83/ FORMANT Harmonic Power'
            ],
            [
              1 / ts_1.musicalHarmonics.averageFormantMinusAllFftPower,
              1 / ts_2.musicalHarmonics.averageFormantMinusAllFftPower,
              1 / ts_3.musicalHarmonics.averageFormantMinusAllFftPower,
              '1/Average FORMANT - ALL FFT Harmonic Power'
            ]
          ))

          data.tremorNegentropicAlgorithm.push(new TremorNA(
            'Summation Harmonic Notes 7.83 Hz Equal Temp Musical Scale',
            [ts_1.totalMusic.raw, ts_2.totalMusic.raw, ts_3.totalMusic.raw, 'Music Raw7.83 Hz (Average)'],
            [ts_1.totalMusic.smth, ts_2.totalMusic.smth, ts_3.totalMusic.smth, 'Music Smoothed 7.83 Hz (Average)']
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

          data.tremorNegentropicAlgorithm.push(new TremorNA(
            'Cross Correlation FFT Musical Scale (Dif)',
            [
              ts_1_2.tables[0].rectifiedCorr,
              ts_2_2.tables[0].rectifiedCorr,
              ts_3_2.tables[0].rectifiedCorr,
              'Correlation FFT&7.83Hz MusicalScale (Normalized)'
            ],
            [
              ts_1_2.tables[1].rectifiedCorr,
              ts_2_2.tables[1].rectifiedCorr,
              ts_3_2.tables[1].rectifiedCorr,
              'Correlation FFT&7.83Hz MusNormSmth 3MovAvg'
            ]
          ))

          data.tremorNegentropicAlgorithm[data.tremorNegentropicAlgorithm.length - 1].result = [
            data.tremorNegentropicAlgorithm[data.tremorNegentropicAlgorithm.length - 1].cells[1][0].line10.value - 100,
            data.tremorNegentropicAlgorithm[data.tremorNegentropicAlgorithm.length - 1].cells[0][1].line10.value - 100
          ]

          data.result = {
            result_1: getResult(0),
            result_2: getResult(1)
          }

          function getResult (index) {
            let arrTna = data.tremorNegentropicAlgorithm

            if (index === 0) {
              return (arrTna[0].result[index] + arrTna[1].result[index] + arrTna[2].result[index] + arrTna[4].result[index] + arrTna[5].result[index] + arrTna[6].result[index] + arrTna[7].result[index] + arrTna[9].result[index]) / 8
            } else {
              return (arrTna[0].result[index] + arrTna[1].result[index] + arrTna[4].result[index] + arrTna[6].result[index] + arrTna[7].result[index]) / 5
            }
          }
          return data
        })
    })
}

module.exports = calculation.getData
