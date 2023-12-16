const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const ejection = new Schema({
    eventID: {
        type: Number
    },
    providerName: {
        type: String
    },
    timeCreated: {
        type: Date
    },
    message: {
        type: String
    },
});


const Event1 = mongoose.model('Event1', ejection);

module.exports = Event1;
