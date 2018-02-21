const getData                     = require('./Tremors').getData;
const getResult                   = require('./Tremors').getResult;


class TremorNA_6 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Musical Harmonics Note Power from PEAK Freq    (Musical Scale Analysis)';

        let title3 = 'Mix VH SPECTRUM    3-Part';
        let title2 = 'Mix VH SPECTRUM    2-Part';
        let title1 = 'Mix VH SPECTRUM    1-Part';

        this.cells = [];
        this.cells.push(getData(title3, title2, title1, ts3.musicalHarmonics.averageHarmonicPower, ts2.musicalHarmonics.averageHarmonicPower, ts1.musicalHarmonics.averageHarmonicPower));
        this.cells.push(getData(title3, title2, title1, 1 / ts3.musicalHarmonics.averageInHarmonicPower, 1 / ts2.musicalHarmonics.averageInHarmonicPower, 1 / ts1.musicalHarmonics.averageInHarmonicPower));
        this.cells.push(getData(title3, title2, title1, ts3.musicalHarmonics.harmonikDevideInharmonikPower, ts2.musicalHarmonics.harmonikDevideInharmonikPower, ts1.musicalHarmonics.harmonikDevideInharmonikPower));
        this.cells.push(getData(title3, title2, title1, ts3.musicalHarmonics.harmonicDevideAllFftPower, ts2.musicalHarmonics.harmonicDevideAllFftPower, ts1.musicalHarmonics.harmonicDevideAllFftPower));

        this.result = [
            {
                address: 'CM12',
                value: getResult(this.cells, 0)
            },
            {
                address: 'CN12',
                value: getResult(this.cells, 1)
            }
        ];
    }
}


module.exports = TremorNA_6;