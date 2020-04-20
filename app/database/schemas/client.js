'use strict';

var Mongoose  = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');
const DEFAULT_USER_PICTURE = "/img/user.jpg";

/**
 * Each connection object represents a client connected through a unique socket.
 *
 */
var clientSchema = new Mongoose.Schema({
    firstname: { type: String, required: true, maxlength: 100, minlength: 3, lowercase: true,trim: true, },
    lastname: { type: String, maxlength: 100, minlength: 3, lowercase: true,trim: true, },
    contactno: { type: String, required:true, maxlength: 50, minlength: 11, },
    address: { type: String, maxlength: 500, minlength: 3,trim: true, },
    email:{ type: String, maxlength: 500, minlength: 5,trim: true, },
    // cnic: { type: String, maxlength:15, minlength:13,},
    // picture: { type: String, default:DEFAULT_USER_PICTURE, maxlength:500, },
    country: { type: String, maxlength:100, minlength:3,  },
    // postalCode: { type: String },
    city: { type: String, maxlength:100, minlength:3 },
    referer: { type: String, maxlength: 100, minlength: 3, lowercase: true,trim: true, },

});

//plugin addings
clientSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
clientSchema.plugin(timestamp);
/*clientSchema.pre('save', function(next) {
    var client = this;
    // ensure client picture is set
    if(!client.picture){
        client.picture = DEFAULT_USER_PICTURE;
    }
    next();
});*/

var customerModel = Mongoose.model('client', clientSchema);

module.exports = customerModel;