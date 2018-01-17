const router                    = require('express').Router();
const Calculation               = require('../calculation');


router.post('/get_data', (req, res) => {
    Calculation
        .then((data) => {
            res.send(data);
        })
});


module.exports = router;