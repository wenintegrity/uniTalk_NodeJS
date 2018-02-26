const getData                     = require('./Tremors').getData;
const getResult                   = require('./Tremors').getResult;


class TremorNA_7 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Summation Harmonic Notes of 7.83 Hz Fundamental Equal Tempered Scale Musical Content (FORMANT Variability)';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.totalMusic.raw, ts2.totalMusic.raw, ts1.totalMusic.raw));
        this.cells.push(getData(title3, title2, title1, ts3.totalMusic.smth, ts2.totalMusic.smth, ts1.totalMusic.smth));
        this.cells.push(getData(title3, title2, title1, ts3.totalMusic.rawSmth, ts2.totalMusic.rawSmth, ts1.totalMusic.rawSmth));
        this.cells.push(getData(title3, title2, title1, ts3.totalMusic.stDevRawTM, ts2.totalMusic.stDevRawTM, ts1.totalMusic.stDevRawTM));
        this.cells.push(getData(title3, title2, title1, ts3.totalMusic.stDevSmthTM, ts2.totalMusic.stDevSmthTM, ts1.totalMusic.stDevSmthTM));

        this.result = [
            getResult(this.cells, 0),
            getResult(this.cells, 1)
        ];
    }
}


module.exports = TremorNA_7;