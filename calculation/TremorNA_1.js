const getData                     = require('./TremorNA').getData;
const getResult                   = require('./TremorNA').getResult;


class TremorNA_1 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Variability of Raw FFT Spectrum';

        let title3 = 'RHYTHMIC Spectral (2H AFTER)';
        let title2 = 'RHYTHMIC Spectral (2H PRE)';
        let title1 = 'RHYTHMIC Spectral (EARTH VIB)';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.stanDotClone / ts3.average.d23_635, ts2.stanDotClone / ts2.average.d23_635, ts1.stanDotClone / ts1.average.d23_635));
        this.cells.push(getData(title3, title2, title1, ts3.stanDotClone, ts2.stanDotClone, ts1.stanDotClone));
        this.cells.push(getData(title3, title2, title1, ts3.average.d23_635, ts2.average.d23_635, ts1.average.d23_635));

        this.result = [
            getResult(this.cells, 0),
            getResult(this.cells, 1)
        ];
    }
}


module.exports = TremorNA_1;