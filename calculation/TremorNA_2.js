class TremorNA_2 {
    constructor(ts1, ts2, ts3) {
        this.tableName = '2';
        this.cells = [];

        let solfg_1 = ts1.objSolfg;
        let solfg_2 = ts2.objSolfg;
        let solfg_3 = ts3.objSolfg;

        this.getData(solfg_3.mixSolft, solfg_2.mixSolft, solfg_1.mixSolft, 'AE10', 'AF10', 'AG10');
        this.getData(solfg_3.sideralDay, solfg_2.sideralDay, solfg_1.sideralDay, 'AH10', 'AI10', 'AJ10');
        this.getData(solfg_3.liberating, solfg_2.liberating, solfg_1.liberating, 'AK10', 'AL10', 'AM10');

        this.getData(solfg_3.breakemo, solfg_2.breakemo, solfg_1.breakemo, 'AN10', 'AO10', 'AP10');
        this.getData(solfg_3.reprLove, solfg_2.reprLove, solfg_1.reprLove, 'AQ10', 'AR10', 'AS10');
        this.getData(solfg_3.connect, solfg_2.connect, solfg_1.connect, 'AT10', 'AU10', 'AV10');
        this.getData(solfg_3.intuition, solfg_2.intuition, solfg_1.intuition, 'AW10', 'AX10', 'AY10');
        this.getData(solfg_3.spirorder, solfg_2.spirorder, solfg_1.spirorder, 'AZ10', 'BA10', 'BB10');

        this.result = [
            {
                address: 'AF12',
                value: (this.cells[0][0].value + this.cells[1][0].value / 2) - 100
            },
            {
                address: 'AG12',
                value: (this.cells[0][1].value + this.cells[1][1].value / 2) - 100
            },
            {
                address: 'AI12',
                value: (this.cells[1][0].value + this.cells[2][0].value / 2) - 100
            },
            {
                address: 'AJ12',
                value: (this.cells[1][1].value + this.cells[2][1].value / 2) - 100
            }
        ]
    }

    getData(data_3, data_2, data_1, link_3, link_2, link_1) {
        let arrResult = [
            {
                address: link_3,
                title: 'Mix VH SPECTRUM    3-Part',
                value: data_3 / data_2 * 100
            },
            {
                address: link_2,
                title: 'Mix VH SPECTRUM    2-Part',
                value: data_2 / data_1 * 100
            },
            {
                address: link_1,
                title: 'Mix VH SPECTRUM    1-Part',
                value: data_1 / data_1 * 100
            }
        ];

        this.cells.push(arrResult);
    }
}


module.exports = TremorNA_2;