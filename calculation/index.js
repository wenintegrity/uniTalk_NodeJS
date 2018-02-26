const Data                              = require('./Data');
const TremorSpectrum                    = require('./TremorSpectrum');
const TremorNA_1                        = require('./TremorNA_1');
const TremorNA_2                        = require('./TremorNA_2');
const TremorNA_3                        = require('./TremorNA_3');
const TremorNA_4                        = require('./TremorNA_4');
const TremorNA_5                        = require('./TremorNA_5');
const TremorNA_6                        = require('./TremorNA_6');
const TremorNA_7                        = require('./TremorNA_7');
const TremorNA_8                        = require('./TremorNA_8');
const timeData                          = require('../data/timeData');
const headers_TremorSpectrum            = require('../data/headers_TremorSpectrum');


let calculation = {};

calculation.getData = (body) => {
    return new Promise((resolve, reject) => {
        let data = {};

        try {
            data.sheet_data_1 = new Data(timeData, body.data_1);
            data.sheet_data_2 = new Data(timeData, body.data_2);
            data.sheet_data_3 = new Data(timeData, body.data_3);

            data.sheet_tremorSpectrum_1 = new TremorSpectrum(data.sheet_data_1);
            data.sheet_tremorSpectrum_2 = new TremorSpectrum(data.sheet_data_2);
            data.sheet_tremorSpectrum_3 = new TremorSpectrum(data.sheet_data_3);

            data.rawSmooth = {
                ts1: data.sheet_tremorSpectrum_1.colSum.raw.avgNotesMusic - data.sheet_tremorSpectrum_1.colSum.smoothed.avgNotesMusic,
                ts2: data.sheet_tremorSpectrum_2.colSum.raw.avgNotesMusic - data.sheet_tremorSpectrum_2.colSum.smoothed.avgNotesMusic,
                ts3: data.sheet_tremorSpectrum_3.colSum.raw.avgNotesMusic - data.sheet_tremorSpectrum_3.colSum.smoothed.avgNotesMusic
            };

            data.headers_sheet_tremorSpectrum = headers_TremorSpectrum;

            data.sheet_tremorNegentropicAlgorithm = [];
            data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_1(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));
            data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_2(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));
            data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_3(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));
            data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_4(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));
            data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_5(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));
            data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_6(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));
            data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_7(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));
            data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_8(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));

            data.result = {
                result_1: getResult(0),
                result_2: getResult(1)
            };

            function getResult(index) {
                let arrTna = data.sheet_tremorNegentropicAlgorithm;

                return (arrTna[0].result[index] + arrTna[1].result[index] + ((arrTna[2].result_1[index] +
                    arrTna[2].result_2[index]) / 2) + arrTna[5].result[index] + arrTna[6].result[index]) / 5;
            }

            resolve(data);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};


module.exports = calculation.getData;