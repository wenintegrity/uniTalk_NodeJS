const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
let db;

module.exports = {
    connect: () => {
        db = MongoClient.connect(url)
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    },

    getConnect: () => {
        return db;
    }
};