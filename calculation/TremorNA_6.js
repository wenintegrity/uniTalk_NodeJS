const getData                   = require('./Tremors').getData;


class TremorNA_6 {
    constructor(ts1, ts2, ts3) {
        this.tableName = '6';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.colSumNormalized.avgNotesMusic, ts2.colSumNormalized.avgNotesMusic, ts1.colSumNormalized.avgNotesMusic, 'BG', 'BH', 'BI'));
        this.cells.push(getData(title3, title2, title1, ts3.colSumSmthNormed.avgNotesMusic, ts2.colSumSmthNormed.avgNotesMusic, ts1.colSumSmthNormed.avgNotesMusic, 'BJ', 'BK', 'BL'));
        this.cells.push(getData(title3, title2, title1,
            ts3.colSumNormalized.avgNotesMusic - ts3.colSumSmthNormed.avgNotesMusic,
            ts2.colSumNormalized.avgNotesMusic - ts2.colSumSmthNormed.avgNotesMusic,
            ts1.colSumNormalized.avgNotesMusic - ts1.colSumSmthNormed.avgNotesMusic, 'BS', 'BT', 'BU'));
    }
}


module.exports = TremorNA_6;