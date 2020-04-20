'use strict';

var Mongoose  = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');
var autopopulate = require('mongoose-autopopulate');
var Double = require('@mongoosejs/double');

var Schema=Mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var withPropertySetSchema = new Mongoose.Schema({
	properties:[{
		property:{type:ObjectId , ref:'property',autopopulate:{maxDepth:1}},
		value:{ type: String, maxlength: 100, minlength: 1, lowercase: true,trim: true, }
	}],
	cost:{ type: Double /*Schema.Types.Double*/ , required: true, min:0,trim: true, },
});

var rawItemSchema = new Mongoose.Schema({
    name: { type: String, required: true, maxlength: 100, minlength: 1, lowercase: true,trim: true, },
    costby: { type: String, required: true, enum :['peritem','parameters'], lowercase: true, trim: true, },
    //costperitem:{type: Double, min:0 trim: true, },
    parameters:[{type:ObjectId , ref:'parameter',autopopulate:{maxDepth:2}}],//raw item kin parameters pa dependent ha.
    properties:[withPropertySetSchema],
},{selectPopulatedPaths:true});

//plugin addings
rawItemSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
rawItemSchema.plugin(timestamp);
rawItemSchema.plugin(autopopulate);

var matModel = Mongoose.model('raw', matSchema);
module.exports = matModel;