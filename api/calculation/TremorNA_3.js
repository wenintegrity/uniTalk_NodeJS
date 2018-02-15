const getData                   = require('./Tremors').getData;


class TremorNA_3 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Harmonic Musical Content of 7.83 Hz Fundamental Equal Tempered Scale';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1,ts3.totalMusicRaw, ts2.totalMusicRaw, ts1.totalMusicRaw, 'BG', 'BH', 'BI'));
        this.cells.push(getData(title3, title2, title1,ts3.totalMusicSmth, ts2.totalMusicSmth, ts1.totalMusicSmth, 'BJ', 'BK', 'BL'));
        this.cells.push(getData(title3, title2, title1,ts3.totalMusicRawStDev, ts2.totalMusicRawStDev, ts1.totalMusicRawStDev, 'BM', 'BN', 'BO'));
        this.cells.push(getData(title3, title2, title1,ts3.totalMusicSmthStDev, ts2.totalMusicSmthStDev, ts1.totalMusicSmthStDev, 'BP', 'BQ', 'BR'));
        this.cells.push(getData(title3, title2, title1,ts3.totalMusicRaw_Smth, ts2.totalMusicRaw_Smth, ts1.totalMusicRaw_Smth, 'BS', 'BT', 'BU'));

        this.result = [
            {
                address: 'BN12',
                value: this.getResult(0)
            },
            {
                address: 'BO12',
                value: this.getResult(1)
            }
        ];
    }

    getResult(index) {
        let amount = 0;

        for (let i = 0; i <= this.cells.length - 2; i++) {
            amount += this.cells[i][index].line10.value;
        }

        return (amount / (this.cells.length - 1)) - 100;
    }
}


module.exports = TremorNA_3;