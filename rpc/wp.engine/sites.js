// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var password = fw.module('password');
var formFilter = fw.module('form_filter');
var settings = fw.module('db_model').EngineSettings;
var site = fw.module('db_model').Site;

exports.get = function(conn, res, args){
	args = formFilter(args, {
		_enginePassword: '',
	});
	settings.get('enginePassword', function(err, r){
		if(err || !r) return res({db: true});
		if(!password.check(args._enginePassword, r))
			return res({pwd: true});
		site.getList(function(err, r){
			if(err) return res({db: true});
			res(null, r);
		});
	});
};

exports.set = function(conn, res, args){
	var enginePassword = args && args._enginePassword;
	if(!enginePassword) enginePassword = '';
	else delete args._enginePassword;
	settings.get('enginePassword', function(err, r){
		if(err || !r) return res({err: {db: true}});
		if(!password.check(enginePassword, r))
			return res({err: {pwd: true}});
		var list = {};
		for(var k in args) {
			if(!k.match(/^\w$/)) continue;
			var domain = String(args[k]).match(/[\S]+/g);
			list[k] = domain;
		}
		site.setList(list, function(err){
			if(err) return res({db: true});
			res();
		});
	});
};