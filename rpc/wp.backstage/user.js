// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var password = fw.module('password');
var formFilter = fw.module('form_filter');
var User = fw.module('db_model').User;

// return the user infomation object of current session
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
