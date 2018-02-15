const getData                   = require('./Tremors').getData;


class TremorNA_1 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Variability of Spectrum';

        let title3 = 'RHYTHMIC Spectral (2H AFTER)';
        let title2 = 'RHYTHMIC Spectral (2H PRE)';
        let title1 = 'RHYTHMIC Spectral (EARTH VIB)';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.averageD23_635, ts2.averageD23_635, ts1.averageD23_635, 'K10', 'L10', 'M10'));
        this.cells.push(getData(title3, title2, title1, ts3.stanDotClone, ts2.stanDotClone, ts1.stanDotClone, 'N10', 'O10', 'P10'));
        this.cells.push(getData(title3, title2, title1, ts3.divisionAverageValuesFftMag_23_404_405_635, ts2.divisionAverageValuesFftMag_23_404_405_635, ts1.divisionAverageValuesFftMag_23_404_405_635, 'Q10', 'R10', 'S10'));
        this.cells.push(getData(title3, title2, title1, ts3.divisionAverageValuesFftMag_23_329_329_635, ts2.divisionAverageValuesFftMag_23_329_329_635, ts1.divisionAverageValuesFftMag_23_329_329_635, 'T10', 'U10', 'V10'));
        this.cells.push(getData(title3, title2, title1, ts3.divisionQuartOnMaxFftMag, ts2.divisionQuartOnMaxFftMag, ts1.divisionQuartOnMaxFftMag, 'W10', 'X10', 'Y10'));
        this.cells.push(getData(title3, title2, title1, ts3.division_q3_average, ts2.division_q3_average, ts1.division_q3_average, 'Z10', 'AA10', 'AB10'));

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

    getResult(index) {
        let amount = 0;

        this.cells.forEach((element) => {
            amount += element[index].line10.value;
        });

        return (amount / this.cells.length) - 100;
    }
}


module.exports = TremorNA_1;