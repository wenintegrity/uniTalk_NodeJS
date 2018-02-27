const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const calculation = new Schema({
    phone_id: {type: String, required: true},
    reqBody: {type: Object, required: true},
    calcData: {type: Object, required: true},
}, {
    timestamps: true
});


module.exports = mongoose.model('Calculations', calculation);

