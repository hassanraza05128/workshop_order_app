'use strict';

var Mongoose  = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');
// var autopopulate = require('mongoose-autopopulate');

var paramSchema = new Mongoose.Schema({
    name: { type: String, required: true, maxlength: 100, minlength: 1, lowercase: true,trim: true, },
    quantity: { type: String, required: true, maxlength: 100, minlength: 1, lowercase: true,trim: true, },
});

//plugin addings
paramSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
paramSchema.plugin(timestamp);
// paramSchema.plugin(autopopulate);

var paramModel = Mongoose.model('parameter', paramSchema);
module.exports = paramModel;