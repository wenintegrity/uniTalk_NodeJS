const MongoClient                   = require('mongodb').MongoClient;
const url                           = 'mongodb://localhost:27017';


let db;

module.exports = {
    connect: () => {
        return db = MongoClient.connect(url);
    },

    getConnect: () => {
        return db;
    }
};