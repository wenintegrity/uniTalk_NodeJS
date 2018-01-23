class TremorNA_6 {
    constructor(ts1, ts2, ts3) {
        this.tableName = '6';
        this.cells = [];

        this.getData(ts3.sumNormalizedAvg, ts2.sumNormalizedAvg, ts1.sumNormalizedAvg, 'BG', 'BH', 'BI');
        this.getData(ts3.sumSmthNormedAvg, ts2.sumSmthNormedAvg, ts1.sumSmthNormedAvg, 'BJ', 'BK', 'BL');
        this.getData(ts3.sumNormalizedAvg - ts3.sumSmthNormedAvg, ts2.sumNormalizedAvg - ts2.sumSmthNormedAvg, ts1.sumNormalizedAvg - ts1.sumSmthNormedAvg, 'BS', 'BT', 'BU');
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
}


module.exports = TremorNA_6;