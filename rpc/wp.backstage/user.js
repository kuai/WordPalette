// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var EMAIL_REGEXP = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\\\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

var fs = require('fs');
var password = fw.module('password');
var formFilter = fw.module('form_filter');
var Site = fw.module('db_model').Site;
var User = fw.module('db_model').User;

// returns the user infomation object of current session
exports.current = function(conn, res, args){
	var id = conn.session.userId;
	var user = User(conn);
	if(!id || !user) return res({});
	user.findOne({id: id}, function(err, r){
		if(err) return res({});
		r.password = !!r.password;
		return res(r);
	});
};

// register an user with id, email and password provided
exports.register = function(conn, res, args){
	// filter data
	args = formFilter(args, {
		id: '',
		password: '',
		email: ''
	});
	if(!args.id.match(/^[-\w]{4,32}$/i)) return res({idIllegal: true});
	if(args.email.length > 64 || !args.email.match(EMAIL_REGEXP)) return res({emailIllegal: true});
	if(args.password.length !== 64) return res({pwd: true});
	// check db status
	var user = User(conn);
	if(!user) return res({system: true});
	// determine user type
	user.count({type: 'admin'}, function(err, count){
		if(count) args.type = 'reader';
		else args.type = 'admin';
		// set deault args
		args.displayName = args.id;
		args.id = args.id.toLowerCase();
		password.hash(args.password, function(err, r){
			if(err) return res({system: true});
			args.password = r;
			// check user exists
			user.findOne({id: args.id}, function(err, r){
				if(err) return res({system: true});
				if(r) return res({idUsed: true});
				user.update({id: args.id}, args, {upsert: true}, function(err){
					if(err) return res({system: true});
					res();
					if(args.type !== 'admin') return;
					// TODO sendmail
				});
			});
		});
	});
};

// login with id and password
exports.login = function(conn, res, args){
	// filter data
	args = formFilter(args, {
		id: '',
		password: ''
	});
	if(!args.id.match(/^[-\w]{4,32}$/i)) return res({idIllegal: true});
	var id = args.id.toLowerCase();
	// check db status
	var user = User(conn);
	if(!user) return res({system: true});
	// check password
	user.findOne({id: id}).select('password').exec(function(err, r){
		if(err) return res({system: true});
		if(!r) return res({idNull: true});
		if(!password.check(args.password, r.password)) return res({pwd: true});
		conn.session.userId = id;
		conn.session.save(function(){
			res();
		});
	});
};

// login with id and password
exports.logout = function(conn, res, args){
	if(!conn.session.userId) return res({noLogin: true});
	delete conn.session.userId;
	conn.session.save(function(){
		res();
	});
};

// modify the current user (except for id, email and password)
exports.modify = function(conn, res, args){
	// filter data
	args = formFilter(args, {
		displayName: '',
		url: ''
	});
	if(args.displayName.length <= 0 || args.displayName.length > 32) return res({displayNameIllegal: true});
	if(!args.url.match(/^https?:\/\//)) args.url = 'http://' + args.url;
	if(args.url.length > 256) return res({urlIllegal: true});
	// check login status
	User.checkPermission(conn, 'reader', function(r){
		if(!r) return res({noPermission: true});
		User(conn).update({id: conn.session.userId}, args, function(err){
			if(err) return res({system: true});
			res();
		});
	});
};

// modify the current user's password
exports.modifyPassword = function(conn, res, args){
	// filter data
	args = formFilter(args, {
		original: '',
		password: ''
	});
	if(args.original.length !== 64 || args.password.length !== 64) return res({pwd: true});
	// check login status
	User.checkPermission(conn, 'reader', function(r){
		if(!r) return res({noPermission: true});
		User(conn).findOne({id: conn.session.userId}).select('password').exec(function(err, r){
			if(err) return res({system: true});
			if(!password.check(args.original, r.password)) return res({pwd: true});
			password.hash(args.password, function(err, r){
				if(err) return res({system: true});
				User(conn).update({id: conn.session.userId}, {password: r}, function(){
					if(err) return res({system: true});
					res();
				});
			});
		});
	});
};

// set current user's custom avatar
exports.avatar = function(conn, res, dataUrl){
	if(typeof(dataUrl) !== 'string' || dataUrl.length >= 100000) return res({system: true});
	User.checkPermission(conn, 'reader', function(r){
		if(!r) return res({noPermission: true});
		if(!dataUrl) {
			// delete avatar
			User(conn).update({id: conn.session.userId}, {avatar: ''}, function(err){
				if(err) return res({system: true});
				var file = Site.dir(conn, 'avatars') + conn.session.userId + '.png';
				fs.unlink(file);
				res();
			});
			return;
		}
		var data = dataUrl.split(',', 2);
		if(data[0] !== 'data:image/png;base64') return res({system: true});
		try {
			var buf = new Buffer(data[1], 'base64');
			var file = Site.dir(conn, 'avatars') + conn.session.userId + '.png';
			fs.writeFile(file, buf, function(err){
				if(err) return res({system: true});
				User(conn).update({id: conn.session.userId}, {avatar: file.slice(file.indexOf('/', 2))}, function(err){
					if(err) return res({system: true});
					res();
				});
			});
		} catch(e) {
			res({system: true});
		}
	});
};