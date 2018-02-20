const getData                     = require('./Tremors').getData;
const getResult                   = require('./Tremors').getResult;


class TremorNA_5 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'FFT (7.83 Hz based Sampling) Power Magnitude of Raw & Normalized Data';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.allFftData.averageAllFftPower, ts2.allFftData.averageAllFftPower, ts1.allFftData.averageAllFftPower));
        this.cells.push(getData(title3, title2, title1, ts3.allFftData.averagePowerSmth, ts2.allFftData.averagePowerSmth, ts1.allFftData.averagePowerSmth));
        this.cells.push(getData(title3, title2, title1, ts3.allFftData.averagePowerSmthNr, ts2.allFftData.averagePowerSmthNr, ts1.allFftData.averagePowerSmthNr));
        this.cells.push(getData(title3, title2, title1,  ts3.allFftData.averagePowerSmth - ts3.allFftData.averageAllFftPower,
            ts2.allFftData.averagePowerSmth - ts2.allFftData.averageAllFftPower, ts1.allFftData.averagePowerSmth - ts1.allFftData.averageAllFftPower));
        this.cells.push(getData(title3, title2, title1, ts3.allFftData.powerOfMaxRawFrequency - ts3.allFftData.maxPowerSmth,
            ts2.allFftData.powerOfMaxRawFrequency - ts2.allFftData.maxPowerSmth, ts1.allFftData.powerOfMaxRawFrequency - ts1.allFftData.maxPowerSmth));
        this.cells.push(getData(title3, title2, title1, ts3.allFftData.maxFrequencyHz, ts2.allFftData.maxFrequencyHz, ts1.allFftData.maxFrequencyHz));

        this.result = [
            {
                address: 'CM12',
                value: getResult(this.crlls, 0)
            },
            {
                address: 'CN12',
                value: getResult(this.cells, 1)
            }
        ];
    }
}


module.exports = TremorNA_5;