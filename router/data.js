const router                    = require('express').Router();
const Calculation               = require('../calculation');


router.post('/get_data', (req, res) => {
    Calculation(req.body)
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
});


module.exports = router;