'use strict';

var Mongoose  = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');
// var autopopulate = require('mongoose-autopopulate');
var Double = require('@mongoosejs/double');
//var autoIncrement = require('mongoose-sequence')(Mongoose)
var Schema=Mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;



var projectSchema = new Mongoose.Schema({
    projectno: { type: Number, required: true, unique: true, max:99999999 , min:1000000},
    client:{type: ObjectId, ref:"client", required: true},
    site_location:{type:String, trim: true, maxlength:500},
    site_address:{type:String, trim: true, maxlength:500},
    confirm_date:{type:Date, trim: true, maxlength:500},
    start_date:{type:Date, trim: true, maxlength:500},
    complete_date:{type:Date, trim: true, maxlength:500},
    status:{type: String, enum :['recorded','initiated', 'working', 'stoped', 'completed', 'paidout' ], required:true, default: "recorded", lowercase: true, trim: true, maxlength:17},
    notes:[{type:String, trim:true, maxlength:500}],

    productsets:[{
        product:{type:ObjectId,required:true, },
        with:[{
            by:{type: String, enum :['peritem','parametermultiple', 'rawsum'], required:true, default: "peritem", lowercase: true, trim: true, maxlength:17},
            parameters:[{
                parameter: { type:ObjectId, ref: "parameter", requied:true},
                value:{type:Double, min:0, trim: true},
            }],
            cost:{type:Double, requied:true, max:9999999999},
        }],
    }],

/*    milestones:[{
        maturity_date:{type:Date, trim: true, maxlength:500},
        // deleveries:{},
    }],*/
    payment_schedules:[{
        amount:{type:Double, trim: true, max:9999999999},
        maturity_date:{type:Date, trim: true, maxlength:500},
    }],
    payments:[{
        payby:{type:String, enum :['cash','craditcard', 'cheque'], required:true, default: "cash", trim: true},
        // receiver:{type:ObjectId,default:"this=>user" , ref:"user" }
        amount:{type:Double, trim: true, max:9999999999},
        date:{type:Date, trim: true, maxlength:500},
    }],

},{selectPopulatedPaths:true});

/*projectSchema.pre('save', function(next) {
    var proj = this;

    if(proj.projectno)

});*/


//plugin addings
projectSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
projectSchema.plugin(timestamp);

var projectModel = Mongoose.model('project', projectSchema);
module.exports = projectModel;