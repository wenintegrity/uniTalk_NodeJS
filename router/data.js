const router                        = require('express').Router();
const Calculation                   = require('../calculation');
const queries                       = require('../queries');
const db                            = require('../db');


router.post('/calculations', (req, res) => {
    Calculation(req.body)
        .then((data) => {
            queries.insertDoc(db.getConnect(), data)
                .then(() => {
                    res.send({"result": data.sheet_tremorSpectrum_1.meanD23_635});
                });
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.get('/calculations', (req, res) => {
    queries.getLastDoc(db.getConnect())
        .then((document) => {
            res.send(document);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

module.exports = router;