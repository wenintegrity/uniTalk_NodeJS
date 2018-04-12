class TremorSpectrum_part_2 {
  constructor (constants, arrFftFreq, arrFreqMagScaleNormalizedData) {
    this.arrConstants = constants
    this.arrFftFreq = arrFftFreq
    this.arrFreqMagScaleNormalizedData = arrFreqMagScaleNormalizedData

    this.min = {}
    this.min.arrConstants = Math.min.apply(null, this.arrConstants)

    this.arrCtntDifFFT_MusicHarmoniRectified = this.getArrCtntDifFFT_MusicHarmoniRectified(this.arrConstants, this.min.arrConstants)

    this.max = {}
    this.max.arrCtntDifFFT_MusicHarmoniRectified = Math.max.apply(null, this.arrCtntDifFFT_MusicHarmoniRectified)

    this.arrCtntDifFFT_MusicHarmoniNormalized = this.getArrCtntDifFFT_MusicHarmoniNormalized(this.arrCtntDifFFT_MusicHarmoniRectified, this.max.arrCtntDifFFT_MusicHarmoniRectified)
    this.arrCtnt_1_DifFFT_MusicHarmoniNormalized = this.getArrCtnt_1_DifFFT_MusicHarmoniNormalized(this.arrCtntDifFFT_MusicHarmoniNormalized)

    this.table_1 = this.getTable_1(this.arrCtnt_1_DifFFT_MusicHarmoniNormalized, this.arrFreqMagScaleNormalizedData)
  }

  getTable_1 (arr_1, arr_2) {
    let arrCtnt_1_DifFFT_MusicNormSmooth3MovAv = this.getArrAverageWithOffset(arr_1, 3, 4)
  }

  getArrAverageWithOffset (arr, start, offset) {
    let result = []

    for (let i = 0; i <= 614; i++) {
      if (i < start) {
        result.push(null)
      } else {
          console.log(arr.slice(i - start, i - start + offset))
        result.push(this.getAverageValue(arr.slice(i - start, i - start + offset)))
      }
    }

    return result
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
