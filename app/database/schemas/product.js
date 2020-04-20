'use strict';

var Mongoose  = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');
// var autopopulate = require('mongoose-autopopulate');
var Double = require('@mongoosejs/double');
//var autoIncrement = require('mongoose-sequence')(Mongoose)
var Schema=Mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;


var contentSchema = new Mongoose.Schema({
    orignalname:{ type: String, required: true, maxlength:100 },
    thumb:{ type: String, required: true, maxlength:100 },
    name:{ type: String, required: true, maxlength:100 },
    mimetype:{ type: String, required: true, maxlength:50 },
    fullpath:{ type: String, required: true, maxlength:100 },
    path:{ type: String, required: true, maxlength:100 },
    size:{ type: Number, required: true, },
    
});

var productSchema = new Mongoose.Schema({
    designid: { type: Number, required: true, unique: true, max:99999 , min:10000},
    name:{type: String, lowercase: true, required: true, trim: true, maxlength:100},
    discription:{type:String, trim: true, maxlength:500},
    contents: [{type: contentSchema,}],

    sellby:{
        by:{type: String, enum :['peritem','parametermultiple', 'rawsum'], required:true, default: "peritem", lowercase: true, trim: true, maxlength:17},
        parameters:[{ type: ObjectId, ref:'parameter'}],
        // rawitems:[{ type: ObjectId, ref:'raw' }],
        cost:{ type: Double /*Schema.Types.Double*/ , min:0,trim: true, }
    },

    material: { type: ObjectId, ref:'material', required: true },
    type: { type: ObjectId, ref:'producttype', required: true },


    //regular
},{selectPopulatedPaths:true});

//plugin addings
productSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
productSchema.plugin(timestamp);

var productModel = Mongoose.model('product', productSchema);
module.exports = productModel;