const createDataForResult                   = require('./createDataForRes');
const ObjectID                              = require('mongodb').ObjectID;
const dbName                                = 'data';


module.exports = {
    insertDoc: (dbConnect, data) => {
        return new Promise((resolve, reject) => {
            return dbConnect
                .then(connect => {
                    let db = connect.db(dbName);
                    const collection = db.collection('documents_2');

                    return collection.insertOne(data)
                        .then(() => {
                            resolve(data);
                        })
                })
                .catch((error) => {
                    reject(error);
                });
        })
    },

    getCalcWithId: (dbConnect, id) => {
        return new Promise((resolve, reject) => {
            return dbConnect
                .then(connect => {
                    let db = connect.db(dbName);
                    const collection = db.collection('documents_2');

                    return collection.findOne({'_id': new ObjectID(id)})
                        .then(doc => {
                            resolve(doc)
                        })
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    getLastDoc: (dbConnect) => {
        return new Promise((resolve, reject) => {
            return dbConnect
                .then(connect => {
                    let db = connect.db(dbName);
                    const collection = db.collection('documents_2');

                    return collection.find({}).sort({_id: 1}).toArray()
                        .then(docs => {
                            resolve(docs[docs.length - 1])
                        })
                })
                .catch((error) => {
                    reject(error);
                })
        })
    },

    findAllInfo: (dbConnect) => {
        return new Promise((resolve, reject) => {
            return dbConnect
                .then(connect => {
                    let db = connect.db(dbName);
                    const collection = db.collection('documents_2');

                    return collection.find({}).toArray()
                        .then(docs => {
                            createDataForResult(docs)
                                .then(data => {
                                    resolve(data);
                                });
                        })
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }
};