const router                        = require('express').Router();
const Calculation                   = require('../calculation');
const queries                       = require('../queries');
const db                            = require('../db');


router.post('/calculations', (req, res) => {
    Calculation(req.body)
        .then((data) => {
            return queries.insertDoc(db.getConnect(), data)
                .then(() => {
                    return res.send(data);
                });
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});

router.get('/calculations', (req, res) => {
    queries.getLastDoc(db.getConnect())
        .then((document) => {
            return res.send(document);
        })
        .catch((error) => {
            return res.status(500).send(error);
        });
});


module.exports = router;