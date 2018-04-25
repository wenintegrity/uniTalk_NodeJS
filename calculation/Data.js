const summaryStatistics = require('summary-statistics')

class Data {
  constructor (timeData, iPadData) {
    this.lengthRow = 2048
    this.arrElements = this.createElementsData(timeData, iPadData)
    this.quartileForIPad = this.getQuartileForIPad(iPadData)
    this.arrOutMicM50 = []
    this.getOutMic0edAndQuartile()
    this.getOutMicFilteredAndQuartile()
    this.getOutMicNrmalz()
    this.getOutMicM50()
  }

  createElementsData (timeData, iPadData) {
    let arrElements = []

    for (let i = 0; i <= this.lengthRow - 1; i++) {
      let newEl = {
        'id': i + 1,
        'time': timeData[i],
        'iPad': iPadData[i]
      }

      arrElements.push(newEl)
    }
    return arrElements
  }

  getQuartileForIPad (iPadData) {
    return summaryStatistics(iPadData)
  }

  getOutMic0edAndQuartile () {
    let arrOutMic0ed = []

    for (let i = 0; i <= this.lengthRow - 1; i++) {
      let outMic0ed = this.arrElements[i].iPad - this.quartileForIPad.min

      this.arrElements[i].outMic0ed = outMic0ed
      arrOutMic0ed.push(outMic0ed)
    }

    this.quartileForOutMic0ed = summaryStatistics(arrOutMic0ed)
  }

  getOutMicFilteredAndQuartile () {
    let medianOM = this.quartileForOutMic0ed.median
    let arrOutMicFiltered = []

    for (let i = 0; i <= this.lengthRow - 1; i++) {
      if (this.arrElements[i].outMic0ed < (medianOM - (Math.abs(1 * medianOM)))) {
        this.arrElements[i].outMicFiltered = medianOM - (Math.abs(1 * medianOM))
      } else {
        if (this.arrElements[i].outMic0ed > (medianOM + (Math.abs(1 * medianOM)))) {
          this.arrElements[i].outMicFiltered = medianOM + (Math.abs(1 * medianOM))
        } else {
          this.arrElements[i].outMicFiltered = this.arrElements[i].outMic0ed
        }
      }
      arrOutMicFiltered.push(this.arrElements[i].outMicFiltered)
    }

    this.quartileForOutMicFilt = summaryStatistics(arrOutMicFiltered)
  }

  getOutMicNrmalz () {
    let arrOutMicNrmalz = []

    for (let i = 0; i <= this.lengthRow - 1; i++) {
      let result = this.arrElements[i].outMicFiltered / this.quartileForOutMicFilt.median * 50

      this.arrElements[i].outMicNrmalz = result
      arrOutMicNrmalz.push(result)
    }

    this.quartileForOutMicNrmalz = summaryStatistics(arrOutMicNrmalz)
  }

  getOutMicM50 () {
    let outMicM50
    for (let i = 0; i <= this.lengthRow - 1; i++) {
      let element = this.arrElements[i]
      outMicM50 = (element.outMicNrmalz - this.quartileForOutMicNrmalz.min) /
                (this.quartileForOutMicNrmalz.max - this.quartileForOutMicNrmalz.min)

      element.outMicM50 = outMicM50
      this.arrOutMicM50.push(outMicM50)
    }
  }
}

module.exports = Data
