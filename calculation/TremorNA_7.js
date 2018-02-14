const getData                   = require('./Tremors').getData;


class TremorNA_7 {
    constructor(ts1, ts2, ts3) {
        this.tableName = '7';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.colSumSmthNorm_1.avgNotesMusic, ts2.colSumSmthNorm_1.avgNotesMusic, ts1.colSumSmthNorm_1.avgNotesMusic, 'BJ', 'BK', 'BL'));
    }
}


module.exports = TremorNA_7;