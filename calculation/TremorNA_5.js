const getData                   = require('./Tremors').getData;


class TremorNA_5 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Formant\'s Variability';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1,ts3.totalMusicRaw, ts2.totalMusicRaw, ts1.totalMusicRaw, 'CL', 'CM', 'CN'));
        this.cells.push(getData(title3, title2, title1,ts3.totalMusicRawStDev, ts2.totalMusicRawStDev, ts1.totalMusicRawStDev, 'CO', 'CP', 'CQ'));
        this.cells.push(getData(title3, title2, title1,ts3.totalMusicSmth, ts2.totalMusicSmth, ts1.totalMusicSmth, 'CR', 'CS', 'CT'));
        this.cells.push(getData(title3, title2, title1,ts3.sumSmoothedStDev, ts2.sumSmoothedStDev, ts1.sumSmoothedStDev, 'CU', 'CV', 'CW'));

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