var mongoose = require('mongoose');

var videoInfoSchema = mongoose.Schema({
    title:              {type: String},
    timeStamp:          {type: Date},
    videoURL:           {type: String},
    refID:              {type: String},
});

module.exports = mongoose.model('videoInfo', videoInfoSchema);