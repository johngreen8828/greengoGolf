var mongoose = require('mongoose');

var canvasInfoSchema = mongoose.Schema({

    imgGName:  			{type: String},
	imgGEmail:  		{type: String},
	imgSwingSegment:  	{type: String},
	imgData: 		 	{type: String},
	imgTimeStamp:  		{type: String},
	imgComments:  		{type: String},
	imgScreenShotNum:  	{type: Number},
	imgSnapped: 		{type: Boolean, default: false},
	refID:              {type: String},
   
});

module.exports = mongoose.model('canvasInfo', canvasInfoSchema);