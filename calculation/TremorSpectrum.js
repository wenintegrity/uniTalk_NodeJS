const fftLib                    = require('fft-js');
const fft                       = fftLib.fft;
const file                      = require('./file');
const complex                   = require('complex');
const summary                   = require('summary');


class TremorSpectrum {
    constructor(data) {
        let arrConst = file.getDataFromFile('./data/constant.json');
        this.arrFftComplex = fft(data.arrOutMicM50);
        this.arrFftFreq = this.getArrFftFreq();
        this.arrFftMag = this.getArrFftMag();
        this.getFreqMagAndConst(arrConst);

        this.maxConstAbs = this.getMaxValue(this.getSliceArr(this.arrConstABS, 2, 364));
        this.maxConstAbs_NO = this.getMaxValue(this.getSliceArr(this.arrConstABS_NO, 2, 364));
        this.maxFreqMag = this.getMaxValue(this.getSliceArr(this.arrFreqMag, 2, 364));
        this.maxFreqMag_NO = this.getMaxValue(this.getSliceArr(this.arrFreqMag_NO, 2, 364));

        this.meanConstAbs = this.getMeanValue(this.getSliceArr(this.arrConstABS, 2, 364));
        this.meanConstAbs_NO = this.getMeanValue(this.getSliceArr(this.arrConstABS_NO, 2, 364));
        this.meanFreqMag = this.getMeanValue(this.getSliceArr(this.arrFreqMag, 2, 364));
        this.meanFreqMag_NO = this.getMeanValue(this.getSliceArr(this.arrFreqMag_NO, 2, 364));

        let arrForResult = this.getArrForResult();
        this.meanD23_635 = summary(arrForResult).mean();
        this.stanDotClone = this.getStanDotClone(arrForResult);

        // this.divisionMeanValuesFftMag_23_404_405_635 = this.getDivisionMeanValuesFftMag_23_404_405_635();
        // this.divisionMeanValuesFftMag_23_329_329_635 = this.getDivisionMeanValuesFftMag_23_329_329_635();
        //
        // this.quartileFftMag_23_635 = this.getQuartile(this.arrFftMag, 2, 615);
        // this.divisionQuartOnMaxFftMag = this.quartileFftMag_23_635.q3 / this.quartileFftMag_23_635.max;
        // this.division_q3_average = this.quartileFftMag_23_635.q3 / this.meanD23_635;
        //
        // this.objSolfg = this.getArrSolfeggio();
        //
        // this.arrConstAbsNormal = this.getArrConstFreq(this.arrConstABS, this.maxConstAbs);
        // this.arrConstAbsNormal_NO = this.getArrConstFreq(this.arrConstABS_NO, this.maxConstAbs_NO);
        // this.arrFreqMagNormal = this.getArrConstFreq(this.arrFreqMag, this.maxFreqMag);
        // this.arrFreqMagNormal_NO = this.getArrConstFreq(this.arrFreqMag_NO, this.maxFreqMag_NO);
        // this.arrFreqMagDiff = this.getFreqMagDiffAnd_NO(this.arrFreqMagNormal, this.arrConstAbsNormal);
        // this.arrFreqMagDiff_NO = this.getFreqMagDiffAnd_NO(this.arrFreqMagNormal_NO, this.arrConstAbsNormal_NO);
        //
        // this.maxFreqMagDiff = this.getMaxValue(this.getSliceArr(this.arrFreqMagDiff, 2, 364));
        // this.maxFreqMagDiff_NO = this.getMaxValue(this.getSliceArr(this.arrFreqMagDiff_NO, 2, 364));
        //
        // this.arrFreqMagDiffNormal = this.getArrConstFreq(this.arrFreqMagDiff, this.maxFreqMagDiff);
        // this.arrFreqMagDiffNormal_NO = this.getArrConstFreq(this.arrFreqMagDiff_NO, this.maxFreqMagDiff_NO);
        //
        // this.powerOctaves = this.getPowerOctaves();
        // this.avgPowerOctaves = this.getAvgPowerOctaves();
    }

    getAvgPowerOctaves() {
        let arr_1 = this.getSliceArr(this.arrFreqMagDiffNormal_NO, 1, 127);
        let arr_2 = this.getSliceArr(this.arrFreqMagDiffNormal_NO, 128, 256);
        let meanForResult = this.getMeanValue(arr_1.concat(arr_2));

        return this.powerOctaves / (meanForResult + this.powerOctaves);
    }

    getPowerOctaves() {
        let arr = this.arrFreqMagDiffNormal;
        let arrNo = this.arrFreqMagDiffNormal_NO;

        return (Number(arr[1]) + Number(arr[3]) + Number(arr[7]) + Number(arr[15]) + Number(arr[31]) + Number(arr[63]) + Number(arrNo[127]) + Number(arrNo[256])) / 8;
    }

    getFreqMagDiffAnd_NO(arr_1, arr_2) {
        let arrResult = [];

        for (let i = 0; i <= arr_1.length - 1; i++) {
            if (arr_1[i] * (1 - arr_2[i])) {
                arrResult.push(arr_1[i] * (1 - arr_2[i]));
            } else {
                arrResult.push('');
            }
        }

        return arrResult;
    }

    getArrConstFreq(arr, maxVal) {
        let arrResult = [];

        for (let i = 0; i <= arr.length - 1; i++) {
            if (arr[i] / maxVal) {
                arrResult.push(arr[i] / maxVal);
            } else {
                arrResult.push('');
            }
        }

        return arrResult;
    }

    getArrSolfeggio() {
        let objResult = {};

        objResult.sideralDay = (this.arrFftMag[25] + this.arrFftMag[50] + this.arrFftMag[100] + this.arrFftMag[199] + this.arrFftMag[399]) / 4;
        objResult.liberating = (this.arrFftMag[101] + this.arrFftMag[51] + this.arrFftMag[203]) / 3;
        objResult.breakemo = (this.arrFftMag[107] + this.arrFftMag[427] + this.arrFftMag[27]) / 3;
        objResult.reprLove = (this.arrFftMag[135] + this.arrFftMag[34] + this.arrFftMag[17]) / 3;
        objResult.connect = this.arrFftMag[164];
        objResult.intuition = this.arrFftMag[190];
        objResult.spirorder = this.arrFftMag[218];
        objResult.mixSolft = (objResult.liberating + objResult.breakemo + objResult.reprLove + objResult.connect + objResult.intuition + objResult.spirorder) / 6;

        return objResult;
    }

    getQuartile(arr, from, to) {
        let arrForResult = this.getSliceArr(arr, from, to);
        let data = summary(arrForResult);

        return {
            q3: data.quartile(0.75),
            max: data.max()
        };
    }

    getDivisionMeanValuesFftMag_23_404_405_635() {
        let arrFftMag_23_404 = this.getSliceArr(this.arrFftMag, 3, 384);
        let arrFftMag_405_635 = this.getSliceArr(this.arrFftMag, 384, 615);

        return summary(arrFftMag_23_404).mean() / summary(arrFftMag_405_635).mean();
    }

    getDivisionMeanValuesFftMag_23_329_329_635() {
        let arrFftMag_23_329 = this.getSliceArr(this.arrFftMag, 2, 309);
        let arrFftMag_329_635 = this.getSliceArr(this.arrFftMag, 308, 615);

        return summary(arrFftMag_23_329).mean() / summary(arrFftMag_329_635).mean();
    }

    getArrFftFreq() {
        let constForArr = 4000 / 1024;
        let arrFftFreq = [0, 4000 / 1024, constForArr + constForArr];

        for (let i = 3; i <= 615 - 1; i++) {
            arrFftFreq.push(arrFftFreq[i - 1] + constForArr);
        }

        return arrFftFreq;
    }

    getArrFftMag() {
        let arrFftMag = [];

        for (let i = 0; i <= this.arrFftFreq.length - 1; i++) {
            arrFftMag.push(2 / 1044 * new complex(this.arrFftComplex[i][0], this.arrFftComplex[i][1]).abs());
        }

        return arrFftMag;
    }

    getArrForResult() {
        return this.arrFftMag.slice(2)
    }

    getSliceArr(arr, from, to) {
        return arr.slice(from, to);
    }

    getMeanValue(arr) {
        let result = 0;
        let index = 0;

        for (let i = 0; i <= arr.length - 1; i++) {
            if (arr[i] !== null && arr[i] !== '') {
                result = result + arr[i];
                index++;
            }
        }

        return result / index;
    }

    getMaxValue(arr) {
        let result = 0;

        for (let i = 0; i <= arr.length - 1; i++) {
            if (result < arr[i]) {
                result = arr[i];
            }
        }

        return result;
    }

    getStanDotClone(arrForResult) {
        let sumX = 0;
        let meanX;

        for (let i = 0; i <= arrForResult.length - 1; i++) {
            if (!isNaN(arrForResult[i])) {
                sumX += arrForResult[i];
            }
        }

        meanX = sumX / (arrForResult.length - 3);


        let sumNumerators = 0;

        arrForResult.forEach((value) => {
            sumNumerators += Math.pow(value - meanX, 2);
        });

        return Math.sqrt(sumNumerators / (arrForResult.length - 1));
    }

    getFreqMagAndConst(arrConst) {
        this.arrFreqMag = [];
        this.arrFreqMag_NO = [];

        this.arrConstABS = [];
        this.arrConstABS_NO = [];

        for (let i = 0; i <= arrConst.length - 1; i++) {
            if (arrConst[i]['constABS'] !== '') {
                this.arrFreqMag.push(this.arrFftMag[i + 1]);
                this.arrFreqMag_NO.push(null);

                this.arrConstABS.push(arrConst[i]['constABS']);
                this.arrConstABS_NO.push(null);
            } else {
                this.arrFreqMag_NO.push(this.arrFftMag[i + 1]);
                this.arrFreqMag.push(null);

                this.arrConstABS_NO.push(arrConst[i]['constABS_No']);
                this.arrConstABS.push(null);
            }
        }
    }
}

module.exports = TremorSpectrum;