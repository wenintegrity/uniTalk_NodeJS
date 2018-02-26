const router                            = require('express').Router();
const Calculation                       = require('../calculation');
const queries                           = require('../model/queries');
const db                                = require('../model/db');
const {check, validationResult}         = require('express-validator/check');
const validPostCalc                     = require('./validations').validPostCalc(check);


router.post('/calculations', validPostCalc, (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
        let _error = new Error('Input data have error');
        _error.status = 400;
        next(_error);
    } else {
        Calculation(req.body.data)
            .then((data) => {
                return queries.insertDoc(db.getConnect(), {
                    phone_id: req.body.id,
                    reqBody: req.body,
                    calcData: data
                })
                    .then((saveData) => {
                        res.set('Access-Control-Allow-Origin', '*');
                        return res.json(saveData.calcData.result.result_1);
                    });
            })
            .catch(next);
    }
});

router.get('/calculations/last', (req, res, next) => {
    queries.getLastDoc(db.getConnect())
        .then((document) => {
            res.set('Access-Control-Allow-Origin', '*');
            return res.json(document);
        })
        .catch(next);
});

router.get('/calculations/all_info', (req, res, next) => {
    queries.findAllInfo(db.getConnect())
        .then((docs) => {
            res.set('Access-Control-Allow-Origin', '*');
            return res.json(docs);
        })
        .catch(next);
});

router.get('/calculations/:id', (req, res, next) => {
    queries.getCalcWithId(db.getConnect(), req.params.id)
        .then((document) => {
            res.set('Access-Control-Allow-Origin', '*');
            return res.json(document);
        })
        .catch(next);
});


module.exports = router;