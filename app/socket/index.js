'use strict';

var config 	= require('../config');
//var redis 	= require('redis').createClient;
//var adapter = require('socket.io-redis');
// var mongoAdapter = require('socket.io-adapter-mongo');
// var mongouri=require('../database').url;


var init = function(app){

	var server 	= require('http').Server(app);
	var io 		= require('socket.io')(server);

	// Force Socket.io to ONLY use "websockets"; No Long Polling.
	// io.set('transports', ['websocket']);

	// // Using Redis
	// let port = config.redis.port;
	// let host = config.redis.host;
	// let password = config.redis.password;
	// let pubClient = redis(port, host, { auth_pass: password });
	// let subClient = redis(port, host, { auth_pass: password, return_buffers: true, });
	//io.adapter(adapter({ pubClient, subClient }));
    // io.adapter(mongoAdapter(mongouri));

	// Allow sockets to access session data
	io.use((socket, next) => {
		require('../session')(socket.request, {}, next);
	});



	// Define all Events
	require('./project.js')(io);

	// The server object will be then used to list to a port number
	return server;
}

module.exports = init;