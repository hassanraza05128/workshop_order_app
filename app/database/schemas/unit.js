'use strict';

var Mongoose  = require('mongoose');
 var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');


var unitSchema = new Mongoose.Schema({
	text 		:{type: String, required: true, maxlength: 100, minlength: 1, lowercase: true,trim: true},
	symbol 		:{type: String, required: true, maxlength: 100, minlength: 1, lowercase: true,trim: true},
	quantity 	:{type: String, required: true, maxlength: 100, minlength: 1, lowercase: true,trim: true},
	e 			:{type: String, required: true, default: 0, maxlength: 100, minlength: 1, lowercase: true,trim: true},
});
//plugin addings
unitSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
unitSchema.plugin(timestamp);

var unitModel = Mongoose.model('unit', unitSchema);
module.exports = unitModel;