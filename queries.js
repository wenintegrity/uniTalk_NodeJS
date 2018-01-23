const dbName                    = 'data';


module.exports = {
    insertDoc: (dbConnect, data) => {
        return new Promise((resolve, reject) => {
            dbConnect
                .then((connect) => {
                    let db = connect.db(dbName);
                    const collection = db.collection('documents');

                    collection.insertOne(data, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log("Inserted 1 documents into the collection");

                            resolve(result);
                        }
                    });
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                })
        });
    },

    getLastDoc: (dbConnect) => {
        return new Promise((resolve, reject) => {
            dbConnect
                .then((connect) => {
                    let db = connect.db(dbName);
                    const collection = db.collection('documents');

                    collection.find({}).sort({_id: 1}).toArray((error, docs) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(docs[docs.length - 1])
                        }
                    });
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                })
        });
    }
};