// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var formFilter = fw.module('form_filter');
var Settings = fw.module('db_model').Settings;
var User = fw.module('db_model').User;
var mail = fw.module('mail');

var tmpl = fw.tmpl('settings.tmpl');
var _ = tmpl.i18n;

// set blog settings
exports.set = function(conn, res, args){
	if(typeof(args) !== 'object') return res({system: true});
	User.checkPermission(conn, 'admin', function(r){
		if(!r) return res({noPermission: true});
		var key = args._key;
		for(var k in args)
			if(k.charAt(0) === '_')
				delete args[k];
		Settings(conn).set(key, args, function(err){
			if(err) return res({system: true})
			res();
		});
	});
};

// get blog settings 
exports.get = function(conn, res, key){
	if(!key) return res({system: true});
	User.checkPermission(conn, 'admin', function(r){
		if(!r) return res({noPermission: true});
		Settings(conn).get(key, function(err, r){
			if(err) return res({system: true});
			res(null, r);
		});
	});
};

// send test email
exports.testEmail = function(conn, res, args){
	args = formFilter(args, {
		name: '',
		addr: '',
		host: '',
		port: 0,
		ssl: '',
		user: '',
		password: ''
	});
	User.checkPermission(conn, 'admin', function(r){
		if(!r) return res({noPermission: true});
		User(conn).findOne({id: conn.session.userId}).select('displayName email').exec(function(err, r){
			if(err || !r) return res({system: true});
			mail(args, r.displayName, r.email, _(conn, 'WordPalette Email Test'), tmpl.testEmail(conn), null, function(err){
				if(err) res({mail: err.data||err.code});
				else res(null, r.email);
			});
		});
	});
};