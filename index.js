'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');

const config = require('./config');
const routerCalc = require('./routers/calculation.route');
const mongoose = require('mongoose');


mongoose.connect(process.env.NODE_MONGO_URL)
    .then(() => {
        app.use(compression());
        app.use(bodyParser.json({limit: '2mb'}));

        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        });
        app.use(routerCalc);

        app.use(function (req, res, next) {
            let _error = new Error('Not found!');
            _error.status = 404;
            next(_error);
        });

        app.use(function (err, req, res, next) {
            res.status(err.status || 500).json({error: err.message});
        });

        app.listen(config.server.port, function () {
            console.log(`Server run at http://localhost:${config.server.port}`);
        });
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });