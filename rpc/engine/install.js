// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('fw.mpa/node_modules/mongoose/node_modules/mongodb');

var tryDb = function(args, next){
	var writePwd = function(db){
		db.createCollection('wp', function(err, res){
			if(err) next(true);
			res.insert({
				key: 'enginePassword',
				value: fw.password.hash(args.enginePassword, args.secret),
			}, function(err){
				if(err) next(true);
				db.close();
				next();
			});
		});
	};
	var db = new mongodb.Db(args.dbName, new mongodb.Server(args.dbHost, args.dbPort, {socketOptions: {connectTimeoutMS: 5000}}), {w: 1});
	db.open(function(err, db){
		if(err) return next(true);
		if(args.dbUser)
			db.authenticate(args.dbUser, args.dbPassword, function(err, res){
				if(err || !res) next(true);
				writePwd(db);
			});
		else
			writePwd(db);
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
		// get random bytes
		crypto.randomBytes(48, function(err, buf){
			if(err) return res({writeFile: true});
			args.secret = buf.toString('base64');
			// try to connect to database server
			tryDb(args, function(err){
				if(err) return res({db: true});
				// write settings
				delete args.enginePassword;
				fs.writeFile('wordpalette.json', JSON.stringify(args), function(err){
					if(err) return res({writeFile: true});
					res();
					fw.restart();
				});
			});
		});
	});
};
