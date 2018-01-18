const MongoClient               = require('mongodb').MongoClient;
const assert                    = require('assert');

const url                       = 'mongodb://localhost:27017';
const dbName                    = 'data';

let connect;

module.exports = {
    connect: () => {
        MongoClient.connect(url, (err, client) => {
            if (err) {
                console.error(err);
                process.exit(1);
            } else {
                console.log("Connected successfully to server");

                connect = client.db(dbName);
            }
        });
    },

    getConnect: () => {
        return connect;
    }
};