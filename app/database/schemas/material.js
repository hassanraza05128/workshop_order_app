'use strict';

var Mongoose  = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');
// var autopopulate = require('mongoose-autopopulate');


var matSchema = new Mongoose.Schema({
    name: { type: String, required: true, maxlength: 100, minlength: 1, lowercase: true,trim: true, },
   // raw: [{type:rawItemSchema}],
});

//plugin addings
matSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
matSchema.plugin(timestamp);
// matSchema.plugin(autopopulate);

var matModel = Mongoose.model('material', matSchema);
module.exports = matModel;