'use strict';

var Mongoose 	= require('mongoose');
var mongoose_delete = require('mongoose-delete');
var timestamp = require('mongoose-timestamp');
var bcrypt      = require('bcrypt-nodejs');
// var autopopulate = require('mongoose-autopopulate');

const SALT_WORK_FACTOR = 10;
const DEFAULT_USER_PICTURE = "/img/user.jpg";

/**
 * Every user has a username, password, socialId, and a picture.
 * If the user registered via username and password(i.e. LocalStrategy), 
 *      then socialId should be null.
 * If the user registered via social authenticaton, 
 *      then password should be null, and socialId should be assigned to a value.
 * 2. Hash user's password
 *
 */
var UserSchema = new Mongoose.Schema({
    name    :   { type: String, required: true, maxlength: 100, minlength: 3, lowercase: true,trim: true,},
    username:   { type: String, required:true, trim: true, maxlength: 100, minlength: 5},
    password:   { type: String, default: null,required: true },
    //socialId: { type: String, default: null },
    type    :   { type: String, default: "editor" ,required: true, enum:['editor','marketer','admin']},
    picture :   { type: String, default:  DEFAULT_USER_PICTURE, maxlength: 500,},
    status  :   { type:String, default: "active", enum:['active','deactive',] },
});

//plugin addings
UserSchema.plugin(mongoose_delete, { deletedAt : true, overrideMethods: true, });
UserSchema.plugin(timestamp, {
    // createdName: 'created_at', // default: 'createdAt'
    // updatedName: 'updated_at', // default: 'updatedAt'
    // disableCreated: false, // Disables the logging of the creation date
    // disableUpdated: false // Disabled the loggin of the modification date
});
// UserSchema.plugin(autopopulate);

/**
 * Before save a user document, Make sure:
 * 1. User's picture is assigned, if not, assign it to default one.
 * 2. Hash user's password
 *
 */
UserSchema.pre('save', function(next) {
    var user = this;

    // ensure user picture is set
    if(!user.picture){
        user.picture = DEFAULT_USER_PICTURE;
    }

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/**
 * Create an Instance method to validate user's password
 * This method will be used to compare the given password with the password stored in the database
 * 
 */
UserSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// Create a user model
var userModel = Mongoose.model('user', UserSchema);

module.exports = userModel;