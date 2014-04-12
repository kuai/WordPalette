// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var formFilter = fw.module('form_filter');
var Post = fw.module('db_model').Post;
var User = fw.module('db_model').User;

// set blog settings
exports.create = function(conn, res, args){
	args = formFilter(args, {
		type: ''
	});
	if(!args.type) return res({system: true});
	User.checkPermission(conn, 'contributor', function(r){
		if(!r) return res({noPermission: true});
		new (Post(conn))({
			type: args.type,
			author: conn.session.userId,
			time: Math.floor(new Date().getTime() / 1000)
		}).save(function(err, r){
			if(err) return res({system: true});
			res(null, r._id);
		});
	});
};

// set blog settings
exports.editorGet = function(conn, res, args){
	args = formFilter(args, {
		_id: ''
	});
	User.checkPermission(conn, 'editor', function(r){
		if(!r) return res({noPermission: true});
		Post(conn).findOne(args, function(err, r){
			if(err) return res({system: true});
			res(null, r);
		});
	});
};
