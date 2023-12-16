const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const insertion = new Schema({
  eventID: Number,
  providerName: String,
  timeCreated: Date,
  message: String,
});

// Create a model using the schema
const Event = mongoose.model('Event', insertion);

module.exports = Event;
