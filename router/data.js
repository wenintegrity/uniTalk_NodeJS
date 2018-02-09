const router                            = require('express').Router();
const Calculation                       = require('../calculation');
const queries                           = require('../queries');
const db                                = require('../db');
const {check, validationResult}         = require('express-validator/check');


const arrValidation = [
    check('data.data_1')
        .not().isEmpty()
        .exists()
        .custom(value => Array.isArray(value)),
    check('data.data_2')
        .not().isEmpty()
        .exists()
        .custom(value => Array.isArray(value)),
    check('data.data_3')
        .not().isEmpty()
        .exists()
        .custom(value => Array.isArray(value))
];


router.post('/calculations', arrValidation, (req, res, next) => {

    if (!validationResult(req).isEmpty()) {
        let _error = new Error('Input data have error');
        _error.status = 400;
        next(_error);
    }

    Calculation(req.body.data)
        .then((data) => {
            return queries.insertDoc(db.getConnect(), {
                reqBody: req.body,
                calcData: data
            })
                .then((saveData) => {
                    return res.json(saveData);
                });
        })
        .catch(next);
});

router.get('/calculations', (req, res, next) => {
    queries.getLastDoc(db.getConnect())
        .then((document) => {
            return res.json(document);
        })
        .catch(next);
});


module.exports = router;