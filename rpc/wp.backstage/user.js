// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var EMAIL_REGEXP = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\\\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

var password = fw.module('password');
var formFilter = fw.module('form_filter');
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
	if(!args.email.match(EMAIL_REGEXP)) return res({emailIllegal: true});
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
					// TODO email
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
