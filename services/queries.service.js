const filterAllInfo = require('./filterAllInfo.service');
const dbSchema = require('../models/calculation.model');


module.exports = {
    insertDoc: (data) => {
        let document = new dbSchema({
            phone_id: data.phone_id,
            reqBody: data.reqBody,
            calcData: data.calcData
        });

        return document.save();
    },

    getLast: () => {
        return dbSchema.findOne().sort({_id: -1});
    },

    findAllInfo: () => {
        return dbSchema.find({})
            .then(docs => {
                return filterAllInfo(docs);
            })
    },

    findById: (id) => {
        return dbSchema.findById(id);
    }
};