const fftLib                    = require('fft-js');
const fft                       = fftLib.fft;
const complex                   = require('complex');
const summary                   = require('summary');
const constants                 = require('../data/constants');


class TremorSpectrum {
    constructor(data) {
        this.arrFftComplex = fft(data.arrOutMicM50);
        this.arrFftFreq = this.getArrFftFreq();
        this.arrFftMag = this.getArrFftMag();
        this.constants = constants;
        this.getFreqMagAndConst(constants);

        this.maxConsts = Math.max.apply(null, this.getSliceArr(constants, 3, 615));
        this.maxFftMag = Math.max.apply(null, this.getSliceArr(this.arrFftMag, 1, 615));
        this.maxFreqMagLess_1 = Math.max.apply(null, this.getSliceArr(this.arrFreqMagInDifLess_1, 3, 365));
        this.maxFreqMag_NO = Math.max.apply(null, this.getSliceArr(this.arrFreqMag_NO, 3, 615));

        this.averageFreqMagMore_1 = this.getAverageValue(this.getSliceArr(this.arrFreqMagInDifMore_1, 3, 615));


        /* ---------------   head file excel №1 ---------------- */
        this.averageD23_635 = summary(this.getSliceArr(this.arrFftMag, 2)).mean();
        this.stanDotClone = this.getStanDotClone(this.getSliceArr(this.arrFftMag, 2, 615));
        this.divisionAverageValuesFftMag_23_404_405_635 = this.getdivisionAverageValuesFftMag_23_404_405_635();
        this.divisionAverageValuesFftMag_23_329_329_635 = this.getdivisionAverageValuesFftMag_23_329_329_635();
        this.quartileFftMag_23_635 = this.getQuartile(this.arrFftMag, 2, 615);
        this.divisionQuartOnMaxFftMag = this.quartileFftMag_23_635.q3 / this.quartileFftMag_23_635.max;
        this.division_q3_average = this.quartileFftMag_23_635.q3 / this.averageD23_635;
        this.objSolfg = this.getArrSolfeggio();
        /* ---------------   /head file excel №1 ---------------- */

        this.arrFreqMagScaleNormalizedData = this.getArrDivElOnVal(this.arrFftMag, this.maxFftMag);

        this.arrConstAbsDifHarmoniNormalLess_1 = this.getArrDivElOnVal(this.arrConstABSDifHarmoniLess_1, this.maxConsts);
        this.arrConstAbsDifHarmoniNormalMore_1 = this.getArrDivElOnVal(this.arrConstABSDifHarmoniMore_1, this.maxConsts);
        this.arrFreqMagNormalMore_1 = this.getarrFreqMagNormalMore_1(this.arrFreqMagInDifMore_1, this.averageFreqMagMore_1);
        this.arrFreqMagNormalLess_1 = this.getArrDivElOnVal(this.arrFreqMagInDifLess_1, this.maxFreqMagLess_1);
        this.arrFreqMagInDifLess_12_More_8 = this.getArrDivElOnVal(this.arrFreqMag_NO, this.maxFreqMag_NO);
        this.arrFreqMagDifDiffLess_1 = this.getFreqMagDiffAnd_NO(this.arrFreqMagNormalLess_1, this.arrConstAbsDifHarmoniNormalLess_1);
        this.arrFreqMagDifDiff_NO = this.getFreqMagDiffAnd_NO(this.arrFreqMagInDifLess_12_More_8, this.arrConstAbsDifHarmoniNormalMore_1);

        this.maxFreqMagDifDiffLess_1 = Math.max.apply(null, this.getSliceArr(this.arrFreqMagDifDiffLess_1, 3, 615));
        this.maxFreqMagDiff_NO = Math.max.apply(null, this.getSliceArr(this.arrFreqMagDifDiff_NO, 3, 615));

        this.arrFreqMagDifDiffNormal = this.getArrDivElOnVal(this.arrFreqMagDifDiffLess_1, this.maxFreqMagDifDiffLess_1);
        this.arrFreqMagDifDiffNormal_NO = this.getArrDivElOnVal(this.arrFreqMagDifDiff_NO, this.maxFreqMagDiff_NO);

        this.averageFreqMagScaleNormalizedData = this.getAverageValue(this.getSliceArr(this.arrFreqMagScaleNormalizedData, 3, 615));
        this.averageFreqMagNormalMore_1 = this.getAverageValue(this.getSliceArr(this.arrFreqMagNormalMore_1, 3, 615));
        this.averageFreqMagNormalLess_1 = this.getAverageValue(this.getSliceArr(this.arrFreqMagNormalLess_1, 3, 615));
        this.averageFreqMagInDifLess_12_More_8 = this.getAverageValue(this.getSliceArr(this.arrFreqMagInDifLess_12_More_8, 3, 615));
        this.averageFreqMagDifDiffNormal = this.getAverageValue(this.getSliceArr(this.arrFreqMagDifDiffNormal, 3, 615));
        this.averageFreqMagDifDiffNormal_NO = this.getAverageValue(this.getSliceArr(this.arrFreqMagDifDiffNormal_NO, 3, 615));

        /* ---------------   head file excel №2 --------------------- */
        this.norm = {};
        this.normScaled = {};

        this.norm.avgPowerHigherOctaves = this.getNormAvgOrNormScaledAvg(this.arrFreqMagNormalLess_1);
        this.norm.avgPowerOctNo = this.norm.avgPowerHigherOctaves / this.averageFreqMagInDifLess_12_More_8;
        this.norm.avgPowerDifScale = this.averageFreqMagNormalLess_1;
        this.norm.avgPowerDifDifNoMore_1 = this.averageFreqMagNormalLess_1 / this.averageFreqMagNormalMore_1;
        this.norm.avgPowerDifDifNo = this.averageFreqMagNormalLess_1 / this.averageFreqMagInDifLess_12_More_8;
        this.norm.avgPowerDifAllScale = this.averageFreqMagNormalLess_1 / this.averageFreqMagScaleNormalizedData;

        this.normScaled.avgPowerHigherOctaves = this.getNormAvgOrNormScaledAvg(this.arrFreqMagDifDiffNormal);
        this.normScaled.avgPowerOctNo = this.normScaled.avgPowerHigherOctaves / this.averageFreqMagDifDiffNormal_NO;
        this.normScaled.avgPowerDifScale = this.averageFreqMagDifDiffNormal;
        this.normScaled.avgPowerDifDifNo = this.averageFreqMagDifDiffNormal / this.averageFreqMagDifDiffNormal_NO;
        /* ---------------   /head file excel №2 -------------------- */

        /* ---------------- calculation tables after read line ------- */
        /* ---------------- data for 3 finish table ------------------ */
        this.maxFftMagNormalized = Math.max.apply(null, this.getSliceArr(this.arrFftMag, 1, 615));
        this.arrFftMagNormalized = this.getFftMagNormalized(this.maxFftMagNormalized);

        this.colSumRaw = this.getColTotalPowerNote(this.arrFftMag);
        this.colSumNormalized = this.getColTotalPowerNote(this.arrFftMagNormalized);

        this.arrFftMagRawSmoothed = this.getArrFftMagRawSmoothed();
        this.colSumSmoothed = this.getColTotalPowerNote(this.arrFftMagRawSmoothed);

        this.totalMusic = {};
        this.totalMusic.Raw = this.colSumRaw.avgNotesMusic;
        this.totalMusic.RawStDev = this.colSumRaw.stDevNotesMusic;
        this.totalMusic.Smth = this.colSumSmoothed.avgNotesMusic;
        this.totalMusic.SmthStDev = this.colSumSmoothed.stDevNotesMusic;
        /* ----------------  /data for 3 finish table ------------------------ */

        /* ----------------  data for other finish table  -------------------- */
        this.arrFftMagNormalizedSmoothed = this.getArrFftMagNormalizedSmoothed(this.arrFftMagRawSmoothed);
        this.colSumSmthNormed = this.getColTotalPowerNote(this.arrFftMagNormalizedSmoothed);

        this.colSumSmthNorm_1 = this.getArrSumSmthNorm_1(this.colSumSmthNormed);
        /*  -------------------- /data for other finish table  -------------------- */

        /* --------------------  two tables after read line wich don't use ---------- */
        this.lowerAndHigherFreq_1 = this.getLowerAndHigherFreq(this.arrFftFreq, this.arrFftMag, this.arrFftMagNormalized);
        this.lowerAndHigherFreq_2 = this.getLowerAndHigherFreq(this.arrFftFreq, this.arrFftMag, this.arrFftMagNormalizedSmoothed);
    }


    getLowerAndHigherFreq(arrFftFreq, arrFftMag, arrFftMagNormalized) {
        let maxFftMag = Math.max.apply(null, this.getSliceArr(arrFftMag, 1));
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
            power: startMag
        };

        for (let i = 55; i >= 0; i--) {
            let freq = arrForResult[i + 1].freq / constDelta;
            if (i >= 29) {
                arrForResult[i] = {
                    freq: freq,
                    power: getNearNumber(freq)
                };
            } else {
                arrForResult[i] = {
                    freq: freq,
                    power: null
                };
            }
        }

        for (let i = 57; i <= 76; i++) {
            let freq = arrForResult[i - 1].freq * constDelta;

            arrForResult[i] = {
                freq: freq,
                power: getNearNumber(freq)
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
        let maxValArr = Math.max.apply(null, cols.arr);
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
        let maxValArr = Math.max.apply(null, this.getSliceArr(arr, 7, 615));
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
            arrForResult.push(this.getAverageValue(this.getSliceArr(this.arrFftMag, i, c)))
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

    getNormAvgOrNormScaledAvg(arr) {
        return (Number(arr[2]) + Number(arr[4]) + Number(arr[8]) + Number(arr[16]) + Number(arr[32]) + Number(arr[64]) + Number(arr[128]) + Number(arr[256]) + Number(arr[512])) / 9;
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

    getarrFreqMagNormalMore_1(arr, val) {
        let arrForResult = this.getSliceArr(arr, 0, 612);
        arrForResult.unshift(val);
        let average = this.getAverageValue(arrForResult);
        let arrResult = [];

        for (let i = 0; i <= arr.length - 1; i++) {
            if (arr[i] / average && arr[i] !== null) {
                arrResult.push(arr[i] / average);
            } else {
                arrResult.push(null);
            }
        }

        return arrResult;

    }

    getArrDivElOnVal(arr, val) {
        let arrResult = [];

        for (let i = 0; i <= arr.length - 1; i++) {
            if (arr[i] / val && arr[i] !== null) {
                arrResult.push(arr[i] / val);
            } else {
                arrResult.push(null);
            }
        }

        return arrResult;
    }

    getArrSolfeggio() {
        let objResult = {};

        objResult.sideralDay = (this.arrFftMag[25] + this.arrFftMag[50] + this.arrFftMag[199] + this.arrFftMag[398]) / 4;
        objResult.liberating = this.arrFftMag[101];
        objResult.breakemo = this.arrFftMag[107];
        objResult.reprLove = this.arrFftMag[135];
        objResult.connect = this.arrFftMag[163];
        objResult.intuition = this.arrFftMag[189];
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

    getdivisionAverageValuesFftMag_23_404_405_635() {
        let arrFftMag_23_404 = this.getSliceArr(this.arrFftMag, 2, 384);
        let arrFftMag_405_635 = this.getSliceArr(this.arrFftMag, 384, 615);

        return summary(arrFftMag_23_404).mean() / summary(arrFftMag_405_635).mean();
    }

    getdivisionAverageValuesFftMag_23_329_329_635() {
        let arrFftMag_23_329 = this.getSliceArr(this.arrFftMag, 2, 309);
        let arrFftMag_329_635 = this.getSliceArr(this.arrFftMag, 308, 615);

        return summary(arrFftMag_23_329).mean() / summary(arrFftMag_329_635).mean();
    }

    getArrFftFreq() {
        let constForArr = 8018 / 2048;
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

    getAverageValue(arr) {
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
        this.arrFreqMagInDifLess_1 = [];
        this.arrFreqMagInDifMore_1 = [];

        this.arrConstABSDifHarmoniLess_1 = [];
        this.arrConstABSDifHarmoniMore_1 = [];

        this.arrFreqMag_NO = [];

        for (let i = 0; i <= arrConst.length - 1; i++) {
            if (arrConst[i] >= 1) {
                this.arrFreqMagInDifMore_1.push(this.arrFftMag[i]);
                this.arrFreqMagInDifLess_1.push(null);

                this.arrConstABSDifHarmoniMore_1.push(arrConst[i]);
                this.arrConstABSDifHarmoniLess_1.push(null);

                arrConst[i] >= 8 && arrConst[i] <= 12 ? this.arrFreqMag_NO.push(this.arrFftMag[i]) : this.arrFreqMag_NO.push(null);
            } else {
                this.arrFreqMagInDifLess_1.push(this.arrFftMag[i]);
                this.arrFreqMagInDifMore_1.push(null);

                this.arrConstABSDifHarmoniLess_1.push(arrConst[i]);
                this.arrConstABSDifHarmoniMore_1.push(null);

                this.arrFreqMag_NO.push(null);
            }
        }
    }
}


module.exports = TremorSpectrum;