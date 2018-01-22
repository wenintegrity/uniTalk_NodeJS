class TremorNA_4 {
    constructor(ts1, ts2, ts3) {
        this.tableName = '4';
        this.cells = [];

        this.getData(ts3.powerOctaves, ts2.powerOctaves, ts1.powerOctaves, 'BW', 'BX', 'BY');
        this.getData(ts3.avgPowerOctaves, ts2.avgPowerOctaves, ts1.avgPowerOctaves, 'BZ', 'CA', 'CB');

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


module.exports = TremorNA_4;