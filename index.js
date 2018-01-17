"use strict";

let express                     = require('express');
let config                      = require('./config');
let app                         = express();

let router                     = require('./router');


Object.keys(router).forEach(component => {
    app.use('/', router[component]);
});

app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send(err);
});

app.listen(config.server.port, function () {
    console.log(`Server run at http://localhost:${config.server.port}`);
});