const assert = require('assert');

module.exports = {
    insertDoc : (db, data) => {
        return new Promise((resolve, reject) => {
            const collection = db.collection('documents');

            collection.insertOne(data, (err, result) => {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                assert.equal(1, result.ops.length);
                console.log("Inserted 1 documents into the collection");

                resolve(result);
            });
        });
    },

    getLastDoc: (db) => {
        return new Promise((resolve, reject) => {
            const collection = db.collection('documents');

            collection.find({}).sort({_id:1}).toArray(function(err, docs) {
                resolve(docs[docs.length - 1])
            });
        });
    }
};