const file                                  = require('./file');
const summaryStatistics                     = require('summary-statistics');


class Data {
    constructor(pathTimeData, pathIPadData) {
        let arrTimes = file.getDataFromFile(pathTimeData);
        let arrIPads = file.getDataFromFile(pathIPadData);
        this.arrElements = this.createElementsData(arrTimes, arrIPads);
        this.quartileForIPad = this.getQuartileForIPad(arrIPads);
        this.arrOutMicM50 = [];
        this.getOutMic0edAndQuartile(arrTimes);
        this.getOutMicFilteredAndQuartile(arrTimes);
        this.getOutMicNrmalz(arrTimes);
        this.getOutMicM50(arrTimes);
    }

    createElementsData(arrTimes, arrIPads) {
        let arrElements = [];

        for (let i = 0; i <= arrTimes.length - 1; i++) {
            let newEl = {
                'time': arrTimes[i],
                'iPad': arrIPads[i]
            };

            arrElements.push(newEl);
        }
        return arrElements;
    }

    getQuartileForIPad(arrIPads) {
        return summaryStatistics(arrIPads);
    }

    getOutMic0edAndQuartile(arrTimes) {
        let arrOutMic0ed = [];

        for (let i = 0; i <= arrTimes.length - 1; i++) {
            let outMic0ed = this.arrElements[i].iPad - this.quartileForIPad.min;

            this.arrElements[i].outMic0ed = outMic0ed;
            arrOutMic0ed.push(outMic0ed);
        }

        this.quartileForOutMic0ed = summaryStatistics(arrOutMic0ed);
    }

    getOutMicFilteredAndQuartile(arrTimes) {
        let medianOM = this.quartileForOutMic0ed.median;
        let arrOutMicFiltered = [];

        for (let i = 0; i <= arrTimes.length - 1; i++) {
            if (this.arrElements[i].outMic0ed < (medianOM - (Math.abs(1 * medianOM)))) {
                this.arrElements[i].outMicFiltered = medianOM - (Math.abs(1 * medianOM));
            } else {
                if (this.arrElements[i].outMic0ed > (medianOM + (Math.abs(1 * medianOM)))) {
                    this.arrElements[i].outMicFiltered = medianOM + (Math.abs(1 * medianOM))
                } else {
                    this.arrElements[i].outMicFiltered = this.arrElements[i].outMic0ed;
                }
            }
            arrOutMicFiltered.push(this.arrElements[i].outMicFiltered);
        }

        this.quartileForOutMicFilt = summaryStatistics(arrOutMicFiltered);
    }

    getOutMicNrmalz(arrTimes) {
        let arrOutMicNrmalz = [];

        for (let i = 0; i <= arrTimes.length - 1; i++) {
            let result = this.arrElements[i].outMicFiltered / this.quartileForOutMicFilt.median * 50;

            this.arrElements[i].outMicNrmalz = result;
            arrOutMicNrmalz.push(result);
        }

        this.quartileForOutMicNrmalz = summaryStatistics(arrOutMicNrmalz);
    }

    getOutMicM50(arrTimes) {
        let outMicM50;
        for (let i = 0; i <= arrTimes.length - 1; i++) {
            let element = this.arrElements[i];
            outMicM50 = (element.outMicNrmalz - this.quartileForOutMicNrmalz.min)
                / (this.quartileForOutMicNrmalz.max - this.quartileForOutMicNrmalz.min);

            element.outMicM50 = outMicM50;
            this.arrOutMicM50.push(outMicM50);
        }
    }
}

module.exports = Data;