const getData                     = require('./TremorNA').getData;
const getResult                   = require('./TremorNA').getResult;


class TremorNA_2 {
    constructor(ts1, ts2, ts3) {
        this.tableName = '7.83Hz & Higher Octaves in FFT Ranges (Normalized Scaled to proximity to 7.83 Hz Eq Temp Musical Notes)';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.normScaled.avgPowerHigherOctaves, ts2.normScaled.avgPowerHigherOctaves, ts1.normScaled.avgPowerHigherOctaves));
        this.cells.push(getData(title3, title2, title1, ts3.normScaled.avgPowerDifScale, ts2.normScaled.avgPowerDifScale, ts1.normScaled.avgPowerDifScale));
        this.cells.push(getData(title3, title2, title1, ts3.normScaled.avgPowerDifDifNo, ts2.normScaled.avgPowerDifDifNo, ts1.normScaled.avgPowerDifDifNo));
        this.cells.push(getData(title3, title2, title1, ts3.normScaled.avgPowerDifScale, ts2.normScaled.avgPowerDifScale, ts1.normScaled.avgPowerDifScale));

        this.result = [
            getResult(this.cells, 0),
            getResult(this.cells, 1)
        ];
    }
}


module.exports = TremorNA_2;