const getData                       = require('./TremorNA').getData;
const getResult                     = require('./TremorNA').getResult;


class TremorNA_8 {
    constructor(ts1, ts2, ts3) {
        this.tableName = 'Max & Min Pwr Notes in Cumulative FFT Music FORMANT';

        let title3 = 'RHYTHMIC Spectral (2H AFTER)';
        let title2 = 'RHYTHMIC Spectral (2H PRE)';
        let title1 = 'RHYTHMIC Spectral (EARTH VIB)';

        this.colls = [
            [
                {
                    title: title3,
                    value: ts3.maxPowerNote
                },
                {
                    title: title2,
                    value: ts2.maxPowerNote
                },
                {
                    title: title1,
                    value: ts1.maxPowerNote
                }
            ],
            [
                {
                    title: title3,
                    value: ts3.minPowerNote
                },
                {
                    title: title2,
                    value: ts2.minPowerNote
                },
                {
                    title: title1,
                    value: ts1.minPowerNote
                }
            ]
        ];
    }
}


module.exports = TremorNA_8;