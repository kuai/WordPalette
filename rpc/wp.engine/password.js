// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var crypto = require('crypto');
var password = fw.module('password');
var formFilter = fw.module('form_filter');
var settings = fw.module('db_model').EngineSettings;

exports.exists = function(conn, res, args){
	settings.get('enginePassword', function(err, r){
		if(err) res(true);
		else res(!!r);
	});
};

exports.modify = function(conn, res, args){
	args = formFilter(args, {
		originalPassword: '',
		enginePassword:   '',
	});
	settings.get('enginePassword', function(err, r){
		if(err) return res({db: true});
		else if(r) {
			if(!password.check(args.originalPassword, r))
				return res({pwd: true});
		}
		password.hash(args.enginePassword, function(err, r){
			if(err) return res({db: true});
			settings.set('enginePassword', r, function(err, r){
				if(err) return res({db: true});
				res();
			});
		});
	});
};
