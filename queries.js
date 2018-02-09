const dbName                    = 'data';


module.exports = {
    insertDoc: (dbConnect, data) => {
        return new Promise((resolve, reject) => {
            return dbConnect
                .then(connect => {
                    let db = connect.db(dbName);
                    const collection = db.collection('documents');

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

    getLastDoc: (dbConnect) => {
        return new Promise((resolve, reject) => {
            return dbConnect
                .then(connect => {
                    let db = connect.db(dbName);
                    const collection = db.collection('documents');

                    return collection.find({}).sort({_id: 1}).toArray()
                        .then(docs => {
                            resolve(docs[docs.length - 1])
                        })
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }
};