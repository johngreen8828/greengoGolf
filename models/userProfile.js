var mongoose = require('mongoose');

var userProfileSchema = mongoose.Schema({
    name:               {type: String},
    email:              {type: String},
    password:           {type: String},
    student:            {type: Boolean},
    teacher:            {type: Boolean},
    homeGolfCourse:     {type: Array, default: []},
    refID:              {type: String},
});

module.exports = mongoose.model('userProfile', userProfileSchema);