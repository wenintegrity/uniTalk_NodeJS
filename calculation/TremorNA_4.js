const getData                     = require('./TremorNA').getData;
const getResult                   = require('./TremorNA').getResult;


class TremorNA_4 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Single Solfeggio Notes in Raw FFT';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.objSolfg.liberating, ts2.objSolfg.liberating, ts1.objSolfg.liberating));
        this.cells.push(getData(title3, title2, title1, ts3.objSolfg.breakemo, ts2.objSolfg.breakemo, ts1.objSolfg.breakemo));
        this.cells.push(getData(title3, title2, title1, ts3.objSolfg.reprLove, ts2.objSolfg.reprLove, ts1.objSolfg.reprLove));
        this.cells.push(getData(title3, title2, title1, ts3.objSolfg.connect, ts2.objSolfg.connect, ts1.objSolfg.connect));
        this.cells.push(getData(title3, title2, title1, ts3.objSolfg.intuition, ts2.objSolfg.intuition, ts1.objSolfg.intuition));
        this.cells.push(getData(title3, title2, title1, ts3.objSolfg.spirorder, ts2.objSolfg.spirorder, ts1.objSolfg.spirorder));
    }
}


module.exports = TremorNA_4;