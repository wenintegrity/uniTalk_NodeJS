const getData                   = require('./Tremors').getData;


class TremorNA_4 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Music According to Fundamental FORMANT:MaxMin Notes';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1,ts3.powerOctaves, ts2.powerOctaves, ts1.powerOctaves, 'BW', 'BX', 'BY'));
        this.cells.push(getData(title3, title2, title1,ts3.avgPowerOctaves, ts2.avgPowerOctaves, ts1.avgPowerOctaves, 'BZ', 'CA', 'CB'));

        this.result = [
            {
                address: 'BX12',
                value: this.getResult(0)
            },
            {
                address: 'BY12',
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


module.exports = TremorNA_4;