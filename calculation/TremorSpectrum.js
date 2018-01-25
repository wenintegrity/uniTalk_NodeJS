const fftLib                    = require('fft-js');
const fft                       = fftLib.fft;
const file                      = require('./file');
const complex                   = require('complex');
const summary                   = require('summary');


class TremorSpectrum {
    constructor(data) {
        this.arrConst = file.getDataFromFile('./data/constant.json');      //let
        this.arrFftComplex = fft(data.arrOutMicM50);
        this.arrFftFreq = this.getArrFftFreq();
        this.arrFftMag = this.getArrFftMag();
        this.getFreqMagAndConst(this.arrConst);

        this.maxConstAbs = summary(this.getSliceArr(this.arrConstABS, 3, 365)).max();
        this.maxConstAbs_NO = summary(this.getSliceArr(this.arrConstABS_NO, 3, 365)).max();
        this.maxFreqMag = summary(this.getSliceArr(this.arrFreqMag, 3, 365)).max();
        this.maxFreqMag_NO = summary(this.getSliceArr(this.arrFreqMag_NO, 3, 365)).max();

        this.meanConstAbs = this.getMeanValue(this.getSliceArr(this.arrConstABS, 3, 365));
        this.meanConstAbs_NO = this.getMeanValue(this.getSliceArr(this.arrConstABS_NO, 3, 365));
        this.meanFreqMag = this.getMeanValue(this.getSliceArr(this.arrFreqMag, 3, 365));
        this.meanFreqMag_NO = this.getMeanValue(this.getSliceArr(this.arrFreqMag_NO, 3, 365));

        this.meanD23_635 = summary(this.getSliceArr(this.arrFftMag, 2)).mean();
        this.stanDotClone = this.getStanDotClone(this.getSliceArr(this.arrFftMag, 2, 615));

        this.divisionMeanValuesFftMag_23_404_405_635 = this.getDivisionMeanValuesFftMag_23_404_405_635();
        this.divisionMeanValuesFftMag_23_329_329_635 = this.getDivisionMeanValuesFftMag_23_329_329_635();

        this.quartileFftMag_23_635 = this.getQuartile(this.arrFftMag, 2, 615);
        this.divisionQuartOnMaxFftMag = this.quartileFftMag_23_635.q3 / this.quartileFftMag_23_635.max;
        this.division_q3_average = this.quartileFftMag_23_635.q3 / this.meanD23_635;

        this.objSolfg = this.getArrSolfeggio();

        this.arrConstAbsNormal = this.getArrConstFreq(this.arrConstABS, this.maxConstAbs);
        this.arrConstAbsNormal_NO = this.getArrConstFreq(this.arrConstABS_NO, this.maxConstAbs_NO);
        this.arrFreqMagNormal = this.getArrConstFreq(this.arrFreqMag, this.maxFreqMag);
        this.arrFreqMagNormal_NO = this.getArrConstFreq(this.arrFreqMag_NO, this.maxFreqMag_NO);
        this.arrFreqMagDiff = this.getFreqMagDiffAnd_NO(this.arrFreqMagNormal, this.arrConstAbsNormal);
        this.arrFreqMagDiff_NO = this.getFreqMagDiffAnd_NO(this.arrFreqMagNormal_NO, this.arrConstAbsNormal_NO);

        this.maxFreqMagDiff = summary(this.getSliceArr(this.arrFreqMagDiff, 2, 364)).max();
        this.maxFreqMagDiff_NO = summary(this.getSliceArr(this.arrFreqMagDiff_NO, 2, 364)).max();

        this.arrFreqMagDiffNormal = this.getArrConstFreq(this.arrFreqMagDiff, this.maxFreqMagDiff);
        this.arrFreqMagDiffNormal_NO = this.getArrConstFreq(this.arrFreqMagDiff_NO, this.maxFreqMagDiff_NO);

        this.powerOctaves = this.getPowerOctaves();
        this.avgPowerOctaves = this.getAvgPowerOctaves();

        /* calculation tables after read line */

        /* data for 3 finish table */

        this.maxFftMagNormalized = summary(this.getSliceArr(this.arrFftMag, 1, 615)).max();  //let
        this.arrFftMagNormalized = this.getFftMagNormalized(this.maxFftMagNormalized);            //let

        this.colSumRaw = this.getColTotalPowerNote(this.arrFftMag);                          //let
        this.colSumNormalized = this.getColTotalPowerNote(this.arrFftMagNormalized);              //let

        this.arrFftMagRawSmoothed = this.getArrFftMagRawSmoothed();                         //let
        this.colSumSmoothed = this.getColTotalPowerNote(this.arrFftMagRawSmoothed);               //let

        this.totalMusicRaw = this.colSumRaw.avgNotesMusic;
        this.totalMusicRawStDev = this.colSumRaw.stDevNotesMusic;

        this.totalMusicSmth = this.colSumSmoothed.avgNotesMusic;
        this.totalMusicSmthStDev = this.colSumNormalized.stDevNotesMusic;

        this.totalMusicRaw_Smth = (this.totalMusicRaw - this.totalMusicSmth) / (this.totalMusicRaw + this.totalMusicSmth);

        /* /data for 3 finish table */

        /* data for other finish table */

        this.arrFftMagNormalizedSmoothed = this.getArrFftMagNormalizedSmoothed(this.arrFftMagRawSmoothed);  //let
        this.colSumSmthNormed = this.getColTotalPowerNote(this.arrFftMagNormalizedSmoothed);                //let

        this.sumSmoothedStDev = this.colSumSmoothed.stDevNotesMusic;
        this.sumNormalizedAvg = this.colSumNormalized.avgNotesMusic;
        this.sumSmthNormedAvg = this.colSumSmthNormed.avgNotesMusic;

        this.arrSumSmthNorm_1 = this.getArrSumSmthNorm_1(this.colSumSmthNormed);
        this.colSumSmthNorm_1Avg = this.arrSumSmthNorm_1.avgNotesMusic;

        /*  /data for other finish table */

        /* two tables after read line wich don't use  */

        this.lowerAndHigherFreq_1 = this.getLowerAndHigherFreq(this.arrFftFreq, this.arrFftMag, this.arrFftMagNormalized);
        this.lowerAndHigherFreq_2 = this.getLowerAndHigherFreq(this.arrFftFreq, this.arrFftMag, this.arrFftMagNormalizedSmoothed);
    }

    getLowerAndHigherFreq(arrFftFreq, arrFftMag, arrFftMagNormalized) {
        let maxFftMag = summary(this.getSliceArr(arrFftMag, 1)).max();
        let constDelta = Math.pow(2, (1 / 12));
        let startFreq;
        let startMag;

        for (let i = 1; i <= arrFftMag.length - 1; i++) {
            if (arrFftMag[i] == maxFftMag) {
                startFreq = arrFftFreq[i];
                startMag = arrFftMagNormalized[i];
            }
        }


        let arrForResult = [];
        arrForResult[56] = {
            freq: startFreq,
            mag: startMag
        };

        for (let i = 55; i >= 0; i--) {
            let freq = arrForResult[i + 1].freq / constDelta;
            if(i >= 29) {
                arrForResult[i] = {
                    freq: freq,
                    mag: getNearNumber(freq)
                };
            }else{
                arrForResult[i] = {
                    freq: freq,
                    mag: null
                };
            }
        }

        for (let i = 57; i <= 76; i++) {
            let freq = arrForResult[i - 1].freq * constDelta;

            arrForResult[i] = {
                freq: freq,
                mag: getNearNumber(freq)
            };
        }

        function getNearNumber(number) {
            for (let i = 0; i <= arrFftFreq.length - 1; i++) {
                if (arrFftFreq[i] > number) {
                    return arrFftMagNormalized[i - 1];
                }
            }
        }

        return arrForResult;
    }

    getArrSumSmthNorm_1(cols) {
        let maxValArr = summary(cols.arr).max();
        let result = {};
        result.arrResult = [];

        cols.arr.forEach((element) => {
            result.arrResult.push(element / maxValArr);
        });

        result.avgNotesMusic = summary(result.arrResult).mean();
        result.stDevNotesMusic = this.getStanDotClone(result.arrResult);

        return result;
    }

    getArrFftMagNormalizedSmoothed(arr) {
        let maxValArr = summary(this.getSliceArr(arr, 7, 615)).max();
        let arrForResult = [];

        arr.forEach((element) => {
            if (element !== null) {
                arrForResult.push(element / maxValArr);
            } else {
                arrForResult.push(null);
            }
        });

        return arrForResult;
    }

    getArrFftMagRawSmoothed() {
        let arrForResult = [null, null, null, null, null, null, null];

        for (let i = 1, c = 8; c <= this.arrFftMag.length; i++, c++) {
            arrForResult.push(this.getMeanValue(this.getSliceArr(this.arrFftMag, i, c)))
        }

        return arrForResult;
    }

    getColTotalPowerNote(arr) {
        let result = {};
        let arrForResult = [];

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 32, 34)) + this.getSumArrEl(this.getSliceArr(arr, 64, 68)) +
            this.getSumArrEl(this.getSliceArr(arr, 128, 135)) + this.getSumArrEl(this.getSliceArr(arr, 255, 270))) / 28);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 34, 36)) + this.getSumArrEl(this.getSliceArr(arr, 68, 72)) +
            this.getSumArrEl(this.getSliceArr(arr, 135, 143)) + this.getSumArrEl(this.getSliceArr(arr, 270, 286))) / 30);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 36, 38)) + this.getSumArrEl(this.getSliceArr(arr, 72, 76)) +
            this.getSumArrEl(this.getSliceArr(arr, 143, 152)) + this.getSumArrEl(this.getSliceArr(arr, 286, 303))) / 31);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 38, 40)) + this.getSumArrEl(this.getSliceArr(arr, 76, 81)) +
            this.getSumArrEl(this.getSliceArr(arr, 152, 161)) + this.getSumArrEl(this.getSliceArr(arr, 303, 320))) / 33);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 40, 43)) + this.getSumArrEl(this.getSliceArr(arr, 81, 86)) +
            this.getSumArrEl(this.getSliceArr(arr, 161, 171)) + this.getSumArrEl(this.getSliceArr(arr, 320, 339))) / 37);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 43, 46)) + this.getSumArrEl(this.getSliceArr(arr, 86, 91)) +
            this.getSumArrEl(this.getSliceArr(arr, 171, 181)) + this.getSumArrEl(this.getSliceArr(arr, 339, 360))) / 39);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 46, 48)) + this.getSumArrEl(this.getSliceArr(arr, 91, 96)) +
            this.getSumArrEl(this.getSliceArr(arr, 181, 191)) + this.getSumArrEl(this.getSliceArr(arr, 360, 381))) / 39);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 48, 51)) + this.getSumArrEl(this.getSliceArr(arr, 96, 101)) +
            this.getSumArrEl(this.getSliceArr(arr, 191, 202)) + this.getSumArrEl(this.getSliceArr(arr, 382, 405))) / 42);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 51, 54)) + this.getSumArrEl(this.getSliceArr(arr, 101, 107)) +
            this.getSumArrEl(this.getSliceArr(arr, 202, 215)) + this.getSumArrEl(this.getSliceArr(arr, 405, 429))) / 46);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 54, 57)) + this.getSumArrEl(this.getSliceArr(arr, 107, 114)) +
            this.getSumArrEl(this.getSliceArr(arr, 215, 227)) + this.getSumArrEl(this.getSliceArr(arr, 429, 453))) / 46);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 57, 60)) + this.getSumArrEl(this.getSliceArr(arr, 114, 121)) +
            this.getSumArrEl(this.getSliceArr(arr, 227, 241)) + this.getSumArrEl(this.getSliceArr(arr, 453, 481))) / 52);

        arrForResult.push((this.getSumArrEl(this.getSliceArr(arr, 60, 64)) + this.getSumArrEl(this.getSliceArr(arr, 121, 128)) +
            this.getSumArrEl(this.getSliceArr(arr, 241, 255)) + this.getSumArrEl(this.getSliceArr(arr, 481, 510))) / 54);

        result.arr = arrForResult;
        result.avgNotesMusic = summary(arrForResult).mean();
        result.stDevNotesMusic = this.getStanDotClone(arrForResult);

        return result;
    }

    getSumArrEl(arr) {
        let result = 0;

        for (let i = 0; i <= arr.length - 1; i++) {
            result += arr[i];
        }

        return result;
    }

    getFftMagNormalized(maxN) {
        let arrResult = [];

        for (let i = 0; i <= this.arrFftMag.length - 1; i++) {
            arrResult.push(this.arrFftMag[i] / maxN);
        }

        return arrResult;
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
                arrResult.push(null);
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
                arrResult.push(null);
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
        let constForArr = 8018 / 2052.608;
        let arrFftFreq = [0, constForArr, constForArr + constForArr];

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

    getSliceArr(arr, from, to) {
        return arr.slice(from, to);
    }

    getMeanValue(arr) {
        let result = 0;
        let index = 0;

        for (let i = 0; i <= arr.length - 1; i++) {
            if (arr[i] !== null && arr[i] !== null) {
                result = result + arr[i];
                index++;
            }
        }

        return result / index;
    }

    getStanDotClone(arrForResult) {
        let sumX = 0;

        for (let i = 0; i <= arrForResult.length - 1; i++) {
            if (!isNaN(arrForResult[i])) {
                sumX += arrForResult[i];
            }
        }

        let meanX = sumX / (arrForResult.length);


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