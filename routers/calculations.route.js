const router = require('express').Router();
const Calculation = require('../calculation');
const queries = require('../services/queries.service');
const {check, validationResult} = require('express-validator/check');
const validPostCalc = require('../services/validations.service').validPostCalc(check);


router.post('/calculations', validPostCalc, (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
        let _error = new Error('Input data have error');
        _error.status = 400;
        next(_error);
    } else {
        Calculation(req.body.data)
            .then((data) => {
                return queries.insertDoc(
                    {
                        phone_id: req.body.id,
                        reqBody: req.body,
                        calcData: data
                    })
                    .then((saveData) => {
                        return res.json(saveData.calcData.result.result_1);
                    });
            })
            .catch(next);
    }
});

router.get('/calculations/last', (req, res, next) => {
    return queries.getLast()
        .then((doc) => {
            return res.json(doc);
        })
        .catch(next);
});

router.get('/calculations/all_info', (req, res, next) => {
    queries.findAllInfo()
        .then((docs) => {
            return res.json(docs);
        })
        .catch(next);
});

router.get('/calculations/:id', (req, res, next) => {
    queries.findById(req.params.id)
        .then((document) => {
            return res.json(document);
        })
        .catch(next);
});


module.exports = router;