const getData                   = require('./Tremors').getData;


class TremorNA_5 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Formant\'s Variability';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.colSumRaw.avgNotesMusic, ts2.colSumRaw.avgNotesMusic, ts1.colSumRaw.avgNotesMusic, 'CL', 'CM', 'CN'));
        this.cells.push(getData(title3, title2, title1, ts3.colSumRaw.stDevNotesMusic, ts2.colSumRaw.stDevNotesMusic, ts1.colSumRaw.stDevNotesMusic, 'CO', 'CP', 'CQ'));
        this.cells.push(getData(title3, title2, title1, ts3.colSumSmoothed.avgNotesMusic, ts2.colSumSmoothed.avgNotesMusic, ts1.colSumSmoothed.avgNotesMusic, 'CR', 'CS', 'CT'));
        this.cells.push(getData(title3, title2, title1, ts3.colSumSmoothed.stDevNotesMusic, ts2.colSumSmoothed.stDevNotesMusic, ts1.colSumSmoothed.stDevNotesMusic, 'CU', 'CV', 'CW'));

        this.result = [
            {
                address: 'CM12',
                value: this.getResult(0)
            },
            {
                address: 'CN12',
                value: this.getResult(1)
            }
        ];
    }

    getResult(index) {
        let amount = 0;

        for (let i = 0; i <= this.cells.length - 1; i++) {
            amount += this.cells[i][index].line10.value;
        }

        return (amount / this.cells.length) - 100;
    }
}


module.exports = TremorNA_5;