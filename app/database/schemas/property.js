'use strict';

var Mongoose  = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');
// var autopopulate = require('mongoose-autopopulate');

var propertySchema = new Mongoose.Schema({
	name:{type: String, required: true, maxlength: 100, minlength: 1, lowercase: true,trim: true},
});
//plugin addings
propertySchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
propertySchema.plugin(timestamp);
// propertySchema.plugin(autopopulate);

var propertyModel = Mongoose.model('property', propertySchema);
module.exports = propertyModel;