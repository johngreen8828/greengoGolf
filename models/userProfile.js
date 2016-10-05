var mongoose = require('mongoose');

var userProfileSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    userType: { type: String },
    refID: { type: String },
});

module.exports = mongoose.model('userProfile', userProfileSchema);