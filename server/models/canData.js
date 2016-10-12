var mongoose = require('mongoose');

var canDataSchema = mongoose.Schema({
    title: { type: String },
    canData: { type: Array },
});

module.exports = mongoose.model('canData', canDataSchema);