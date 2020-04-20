'use strict';

var Mongoose  = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');
var Schema=Mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;


var producttypeSchema = new Mongoose.Schema({
    parent:{type:ObjectId, default:null,ref:"producttype"},
    name: { type: String, required: true, unique:true, maxlength: 100, minlength: 3, lowercase: true,trim: true, },
    code: { type: String, unique:true, maxlength: 4, minlength: 4, lowercase: false, default:null },//only for leave nodes
    isleaf: { type: Boolean, required: true, default:false },//only for leave nodes
    //tags:{},
});

//plugin addings
producttypeSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
producttypeSchema.plugin(timestamp);

var producttypeModel = Mongoose.model('producttype', producttypeSchema);
module.exports = producttypeModel;