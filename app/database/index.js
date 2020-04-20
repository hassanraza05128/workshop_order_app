'use strict';

var config 		= require('../config');
var Mongoose 	= require('mongoose');
var logger 		= require('../logger');

// Connect to the database
// construct the database URI and encode username and password.
var dbURI = "mongodb://" + 
			encodeURIComponent(config.db.username) + ":" + 
			encodeURIComponent(config.db.password) + "@" + 
			config.db.host + ":" + 
			config.db.port + "/" + 
			config.db.name;
Mongoose.connect(dbURI, { useNewUrlParser: true,});
Mongoose.set('useCreateIndex',true);

// Throw an error if the connection fails
Mongoose.connection.on('error', function(err) {
	if(err) throw err;
});

// mpromise (mongoose's default promise library) is deprecated, 
// Plug-in your own promise library instead.
// Use native promises
Mongoose.Promise = global.Promise;
//console.log(Mongoose.connection);

module.exports = { Mongoose, 
	models: {
        client: require('./schemas/client.js'),
        material: require('./schemas/material.js'),
				parameter: require('./schemas/parameter.js'),
		project: require('./schemas/project.js'),
		product: require('./schemas/product.js'),
        producttype: require('./schemas/producttype.js'),
        property: require('./schemas/property.js'),
        //room: require('./schemas/room.js'),
        unit: require('./schemas/unit.js'),
        user: require('./schemas/user.js'),
	},url:dbURI
};
