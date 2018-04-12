const getData                     = require('./TremorNA').getData;
const getResult                   = require('./TremorNA').getResult;


class TremorNA_3 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Presence of Environmental & Cosmic Frequencies In Raw FFT ';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells_1 = [];
        this.cells_1.push(getData(title3, title2, title1, ts3.objSolfg.mixSolft, ts2.objSolfg.mixSolft, ts1.objSolfg.mixSolft));

        this.cells_2 = [];
        this.cells_2.push(getData(title3, title2, title1, ts3.objSolfg.sideralDay, ts2.objSolfg.sideralDay, ts1.objSolfg.sideralDay,));

        this.result_1 = [
            getResult(this.cells_1, 0),
            getResult(this.cells_1, 1)
        ];

        this.result_2 = [
            getResult(this.cells_2, 0),
            getResult(this.cells_2, 1)
        ];
    }
}


module.exports = TremorNA_3;