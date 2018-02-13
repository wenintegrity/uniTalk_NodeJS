const getData                   = require('./Tremors').getData;


class TremorNA_6 {
    constructor(ts1, ts2, ts3) {
        this.tableName = '6';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1,ts3.sumNormalizedAvg, ts2.sumNormalizedAvg, ts1.sumNormalizedAvg, 'BG', 'BH', 'BI'));
        this.cells.push(getData(title3, title2, title1,ts3.sumSmthNormedAvg, ts2.sumSmthNormedAvg, ts1.sumSmthNormedAvg, 'BJ', 'BK', 'BL'));
        this.cells.push(getData(title3, title2, title1,ts3.sumNormalizedAvg - ts3.sumSmthNormedAvg, ts2.sumNormalizedAvg - ts2.sumSmthNormedAvg, ts1.sumNormalizedAvg - ts1.sumSmthNormedAvg, 'BS', 'BT', 'BU'));
    }
}


module.exports = TremorNA_6;