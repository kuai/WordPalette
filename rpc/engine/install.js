// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('fw.mpa/node_modules/mongoose/node_modules/mongodb');

var tryDb = function(args, next){
	var db = new mongodb.Db(args.dbName, new mongodb.Server(args.dbHost, args.dbPort, {socketOptions: {connectTimeoutMS: 5000}}), {w: 1});
	db.open(function(err, db){
		if(err) return next(true);
		db.authenticate(args.dbUser, args.dbPassword, function(err, res){
			db.close();
			if(err || !res) next(true);
			else next(false);
		});
	});
};

module.exports = function(conn, args, res){
	args = fw.formFilter(args, {
		enginePassword: '',
		dbHost:         'localhost',
		dbPort:         27017,
		dbName:         '',
		dbUser:         '',
		dbPassword:     '',
	});
	if(!args.enginePassword) return res({});
	// check file existence
	fs.exists('wordpalette.json', function(err, r){
		if(err || r) return res({writeFile: true});
		// try to connect to database server
		tryDb(args, function(err){
			if(err) return res({db: true});
			// get random bytes
			crypto.randomBytes(48, function(err, buf){
				if(err) return res({writeFile: true});
				args.secret = buf.toString('base64');
				// write settings
				fs.writeFile('wordpalette.json', JSON.stringify(args), function(err){
					if(err) return res({writeFile: true});
					res();
					fw.restart();
				});
			});
		});
	});
};