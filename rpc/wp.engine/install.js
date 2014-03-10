// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var fs = require('fs');
var crypto = require('crypto');
var mongodb = require('fw.mpa/node_modules/mongoose/node_modules/mongodb');
var password = fw.module('password');
var formFilter = fw.module('form_filter');

var tryDb = function(args, next){
	var writePwd = function(db){
		db.createCollection('wp', function(err, res){
			if(err) return next(true);
			password.hash(args.enginePassword, function(err, auth){
				if(err) return next(true);
				res.update({_id: 'enginePassword'}, {_id: 'enginePassword', v: auth}, {upsert: true}, function(err){
					if(err) return next(true);
					db.close();
					next();
				});
			});
		});
	};
	var db = new mongodb.Db(args.dbName, new mongodb.Server(args.dbHost, args.dbPort, {socketOptions: {connectTimeoutMS: 5000}}), {w: 1});
	db.open(function(err, db){
		if(err) return next(true);
		if(args.dbUser)
			db.authenticate(args.dbUser, args.dbPassword, function(err, res){
				if(err || !res) return next(true);
				writePwd(db);
			});
		else
			writePwd(db);
	});
};

module.exports = function(conn, res, args){
	args = formFilter(args, {
		enginePassword: '',
		dbHost:         'localhost',
		dbPort:         27017,
		dbName:         '',
		dbUser:         '',
		dbPassword:     '',
	});
	if(!args.enginePassword) return res({});
	// check file existence
	fs.exists('config.json', function(err, r){
		if(err || r) return res({writeFile: true});
		// get random bytes
		crypto.randomBytes(24, function(err, buf){
			if(err) return res({writeFile: true});
			args.secret = buf.toString('base64');
			// try to connect to database server
			tryDb(args, function(err){
				if(err) return res({db: true});
				// write settings
				delete args.enginePassword;
				fs.writeFile('config.json', JSON.stringify(args), function(err){
					if(err) return res({writeFile: true});
					res();
					fw.restart();
				});
			});
		});
	});
};
