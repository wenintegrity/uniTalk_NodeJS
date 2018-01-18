const Data                              = require('./Data');
const TremorSpectrum                    = require('./TremorSpectrum');
const TremorNA_1                        = require('./TremorNA_1');
const TremorNA_2                        = require('./TremorNA_2');
const timeData                          = require('./timeData');


let calculation = {};

calculation.getData = (body) => {
    return new Promise((resolve, reject) => {
        let data = {};

        try {
            data.sheet_data_1 = new Data(timeData, body);
            // data.sheet_data_2 = new Data('./data/timeData2.json', './data/iPadData2.json');
            // data.sheet_data_3 = new Data('./data/timeData3.json', './data/iPadData3.json');

            data.sheet_tremorSpectrum_1 = new TremorSpectrum(data.sheet_data_1);
            // data.sheet_tremorSpectrum_2 = new TremorSpectrum(data.sheet_data_2);
            // data.sheet_tremorSpectrum_3 = new TremorSpectrum(data.sheet_data_3);

            // data.sheet_tremorNegentropicAlgorithm = [];
            // data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_1(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));
            // data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_2(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));

            resolve(data);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};


module.exports = calculation.getData;