"use strict";

const express                     = require('express');
const app                         = express();
const bodyParser                  = require('body-parser');
const compression                 = require('compression');

const config                      = require('./config');
const router                      = require('./router');
const db                          = require('./db');


db.connect()
    .then(() => {
        app.use(compression());
        app.use(bodyParser.json());

        Object.keys(router).forEach(component => {
            app.use('/', router[component]);
        });

        app.use(function(req, res, next) {
            let _error = new Error('Not found!');
            _error.status = 404;
            next(_error);
        });

        app.use(function (err, req, res, next) {
            res.status(err.status).json({error: err.message});
        });

        app.listen(config.server.port, function () {
            console.log(`Server run at http://localhost:${config.server.port}`);
        });
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });