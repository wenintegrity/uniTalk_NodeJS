const getData                   = require('./Tremors').getData;


class TremorNA_2 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Presence of Environmental and Cosmic Frequencies';

        let solfg_1 = ts1.objSolfg;
        let solfg_2 = ts2.objSolfg;
        let solfg_3 = ts3.objSolfg;

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1,solfg_3.mixSolft, solfg_2.mixSolft, solfg_1.mixSolft, 'AE', 'AF', 'AG'));
        this.cells.push(getData(title3, title2, title1,solfg_3.sideralDay, solfg_2.sideralDay, solfg_1.sideralDay, 'AH', 'AI', 'AJ'));
        this.cells.push(getData(title3, title2, title1,solfg_3.liberating, solfg_2.liberating, solfg_1.liberating, 'AK', 'AL', 'AM'));

        this.cells.push(getData(title3, title2, title1,solfg_3.breakemo, solfg_2.breakemo, solfg_1.breakemo, 'AN', 'AO', 'AP'));
        this.cells.push(getData(title3, title2, title1,solfg_3.reprLove, solfg_2.reprLove, solfg_1.reprLove, 'AQ', 'AR', 'AS'));
        this.cells.push(getData(title3, title2, title1,solfg_3.connect, solfg_2.connect, solfg_1.connect, 'AT', 'AU', 'AV'));
        this.cells.push(getData(title3, title2, title1,solfg_3.intuition, solfg_2.intuition, solfg_1.intuition, 'AW', 'AX', 'AY'));
        this.cells.push(getData(title3, title2, title1,solfg_3.spirorder, solfg_2.spirorder, solfg_1.spirorder, 'AZ', 'BA', 'BB'));

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
}


module.exports = TremorNA_2;