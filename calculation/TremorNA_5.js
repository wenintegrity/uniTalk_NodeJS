class TremorNA_5 {
    constructor(ts1, ts2, ts3) {
        this.tableName = '5';
        this.cells = [];

        this.getData(ts3.totalMusicRaw, ts2.totalMusicRaw, ts1.totalMusicRaw, 'CL', 'CM', 'CN');
        this.getData(ts3.totalMusicRawStDev, ts2.totalMusicRawStDev, ts1.totalMusicRawStDev, 'CO', 'CP', 'CQ');
        this.getData(ts3.totalMusicSmth, ts2.totalMusicSmth, ts1.totalMusicSmth, 'CR', 'CS', 'CT');
        this.getData(ts3.sumSmoothedStDev, ts2.sumSmoothedStDev, ts1.sumSmoothedStDev, 'CU', 'CV', 'CW');

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

    getData(data_3, data_2, data_1, link_3, link_2, link_1) {
        let arrResult = [
            {
                title: 'Mix VH SPECTRUM    3-Part',
                line9: {
                    address: link_3 + 9,
                    value: data_3
                },
                line10: {
                    address: link_3 + 10,
                    value: data_3 / data_2 * 100
                }
            },
            {
                title:
                    'Mix VH SPECTRUM    2-Part',
                line9: {
                    address: link_2 + 9,
                    value: data_2
                },
                line10: {
                    address: link_2 + 10,
                    value: data_2 / data_1 * 100
                }
            },
            {
                title:
                    'Mix VH SPECTRUM    1-Part',
                line9: {
                    address: link_1 + 9,
                    value: data_1
                },
                line10: {
                    address: link_1 + 10,
                    value: data_1 / data_1 * 100
                }
            }
        ];

        this.cells.push(arrResult);
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