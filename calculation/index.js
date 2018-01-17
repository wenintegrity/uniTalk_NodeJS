const Data                              = require('./Data');
const TremorSpectrum                    = require('./TremorSpectrum');
const TremorNA_1                        = require('./TremorNA_1');
const TremorNA_2                        = require('./TremorNA_2');


let calculation = {};

calculation.getData = new Promise((resolve, reject) => {
    let data = {};

    try {
        data.sheet_data_1 = new Data('./data/timeData1.json', './data/iPadData1.json');
        data.sheet_data_2 = new Data('./data/timeData2.json', './data/iPadData2.json');
        data.sheet_data_3 = new Data('./data/timeData3.json', './data/iPadData3.json');

        data.sheet_tremorSpectrum_1 = new TremorSpectrum(data.sheet_data_1);
        data.sheet_tremorSpectrum_2 = new TremorSpectrum(data.sheet_data_2);
        data.sheet_tremorSpectrum_3 = new TremorSpectrum(data.sheet_data_3);

        data.sheet_tremorNegentropicAlgorithm = [];
        data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_1(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));
        data.sheet_tremorNegentropicAlgorithm.push(new TremorNA_2(data.sheet_tremorSpectrum_1, data.sheet_tremorSpectrum_2, data.sheet_tremorSpectrum_3));

        resolve(data);

        // require('fs').writeFileSync('./calculation/result/sheet_data_1.json', JSON.stringify(data.sheet_data_1, null, 2));
        // require('fs').writeFileSync('./calculation/result/sheet_data_2.json', JSON.stringify(data.sheet_data_2, null, 2));
        // require('fs').writeFileSync('./calculation/result/sheet_data_3.json', JSON.stringify(data.sheet_data_3, null, 2));
        //
        // require('fs').writeFileSync('./calculation/result/sheet_tremorSpectrum_1.json', JSON.stringify(data.sheet_tremorSpectrum_1, null, 2));
        // require('fs').writeFileSync('./calculation/result/sheet_tremorSpectrum_2.json', JSON.stringify(data.sheet_tremorSpectrum_2, null, 2));
        // require('fs').writeFileSync('./calculation/result/sheet_tremorSpectrum_3.json', JSON.stringify(data.sheet_tremorSpectrum_3, null, 2));
        //
        // require('fs').writeFileSync('./calculation/result/sheet_tremorNegentropicAlgorithm.json', JSON.stringify(data.sheet_tremorNegentropicAlgorithm, null, 2));

    } catch (error) {
        console.error(error);
        reject();
    }
});


module.exports = calculation.getData;