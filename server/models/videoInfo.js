var mongoose = require('mongoose');

var videoInfoSchema = mongoose.Schema({
    title: { type: String },
    timeStamp: { type: Date },
    videoURL: { type: String },
    user: { type: String }
});
    //refID: { type: mongoose.Schema.ObjectId, ref: "User" },

module.exports = mongoose.model('videoInfo', videoInfoSchema);