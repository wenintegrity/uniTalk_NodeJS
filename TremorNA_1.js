class TremorNA_1 {
    constructor(ts1, ts2, ts3) {
        this.tableName = '1';
        this.cells = [];

        this.getData(ts3.meanD23_635, ts2.meanD23_635, ts1.meanD23_635, 'K10', 'L10', 'M10');
        this.getData(ts3.stanDotClone, ts2.stanDotClone, ts1.stanDotClone, 'N10', 'O10', 'P10');
        this.getData(ts3.divisionMeanValuesFftMag_23_404_405_635, ts2.divisionMeanValuesFftMag_23_404_405_635, ts1.divisionMeanValuesFftMag_23_404_405_635, 'Q10', 'R10', 'S10');
        this.getData(ts3.divisionMeanValuesFftMag_23_329_329_635, ts2.divisionMeanValuesFftMag_23_329_329_635, ts1.divisionMeanValuesFftMag_23_329_329_635, 'T10', 'U10', 'V10');
        this.getData(ts3.divisionQuartOnMaxFftMag, ts2.divisionQuartOnMaxFftMag, ts1.divisionQuartOnMaxFftMag, 'W10', 'X10', 'Y10');
        this.getData(ts3.division_q3_average, ts2.division_q3_average, ts1.division_q3_average, 'Z10', 'AA10', 'AB10');

        this.result = [
            {
                address: 'M12',
                value: this.getResult(1)
            },
            {
                address: 'L12',
                value: this.getResult(0)
            }
        ];
    }

    getData(data_3, data_2, data_1, link_1, link_2, link_3) {
        let arrResult = [
            {
                address: link_1,
                title: 'RHYTHMIC Spectral (2H AFTER)',
                value: data_3 / data_2 * 100
            },
            {
                address: link_2,
                title: 'RHYTHMIC Spectral (2H PRE)',
                value: data_2 / data_1 * 100
            },
            {
                address: link_3,
                title: 'RHYTHMIC Spectral (EARTH VIB)',
                value: data_1 / data_1 * 100
            }
        ];

        this.cells.push(arrResult);
    }

    getResult(index) {
        let amount = 0;

        this.cells.forEach((element) => {
            amount += element[index].value;
        });

        return (amount / this.cells.length) - 100;
    }
}


module.exports = TremorNA_1;