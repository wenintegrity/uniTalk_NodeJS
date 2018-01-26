class TremorNA_2 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Presence of Environmental and Cosmic Frequencies';
        this.cells = [];

        let solfg_1 = ts1.objSolfg;
        let solfg_2 = ts2.objSolfg;
        let solfg_3 = ts3.objSolfg;

        this.getData(solfg_3.mixSolft, solfg_2.mixSolft, solfg_1.mixSolft, 'AE', 'AF', 'AG');
        this.getData(solfg_3.sideralDay, solfg_2.sideralDay, solfg_1.sideralDay, 'AH', 'AI', 'AJ');
        this.getData(solfg_3.liberating, solfg_2.liberating, solfg_1.liberating, 'AK', 'AL', 'AM');

        this.getData(solfg_3.breakemo, solfg_2.breakemo, solfg_1.breakemo, 'AN', 'AO', 'AP');
        this.getData(solfg_3.reprLove, solfg_2.reprLove, solfg_1.reprLove, 'AQ', 'AR', 'AS');
        this.getData(solfg_3.connect, solfg_2.connect, solfg_1.connect, 'AT', 'AU', 'AV');
        this.getData(solfg_3.intuition, solfg_2.intuition, solfg_1.intuition, 'AW', 'AX', 'AY');
        this.getData(solfg_3.spirorder, solfg_2.spirorder, solfg_1.spirorder, 'AZ', 'BA', 'BB');

        this.result = [
            {
                address: 'AF12',
                value: (this.cells[0][0].line10.value + this.cells[1][0].line10.value / 2) - 100
            },
            {
                address: 'AG12',
                value: (this.cells[0][1].line10.value + this.cells[1][1].line10.value / 2) - 100
            },
            {
                address: 'AI12',
                value: (this.cells[1][0].line10.value + this.cells[2][0].line10.value / 2) - 100
            },
            {
                address: 'AJ12',
                value: (this.cells[1][1].line10.value + this.cells[2][1].line10.value / 2) - 100
            }
        ]
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
                title: 'Mix VH SPECTRUM    2-Part',
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
                title: 'Mix VH SPECTRUM    1-Part',
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


module.exports = TremorNA_2;