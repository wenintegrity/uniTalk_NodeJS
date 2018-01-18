"use strict";

const express                     = require('express');
const app                         = express();
const bodyParser                  = require('body-parser');

const config                      = require('./config');
const router                      = require('./router');
const db                          = require('./db');


db.connect();

app.use(bodyParser.json());

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