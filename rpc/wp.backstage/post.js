// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var formFilter = fw.module('form_filter');
var Post = fw.module('db_model').Post;
var User = fw.module('db_model').User;

// create a new post and return its id
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

// modify a post
exports.set = function(conn, res, args){
	var filtered = formFilter(args, {
		_id: '',
		status: 'draft',
		author: '',
		time: 0
	});
	if(args.type) delete args.type;
	for(var k in filtered)
		args[k] = filtered[k];
	if(!args.time) args.time = new Date().getTime() / 1000;
	if(args.time >= 2147483647) return res({system: true});
	User.checkPermission(conn, ['contributor', 'writer', 'editor'], function(contributor, writer, editor){
		// check permission
		if(!contributor) return res({noPermission: true});
		if(!writer && (args.status !== 'draft' && args.status !== 'pending'))
			return res({noPermission1: true});
		if(!editor && args.author !== conn.session.userId)
			return res({noPermission: true});
		Post(conn).findOne({_id: args._id}, function(err, r){
			if(err) return res({system: true});
			if(!editor && r.author !== conn.session.userId)
				return res({noPermission: true});
			// save
			var id = args._id
			delete args._id;
			Post(conn).update({_id: id}, args, function(err){
				if(err) return res({system: true});
				res();
			});
		});
	});
};

// get a post for editing
exports.get = function(conn, res, args){
	args = formFilter(args, {
		_id: ''
	});
	User.checkPermission(conn, ['contributor', 'editor'], function(contributor, editor){
		if(!contributor) return res({noPermission: true});
		Post(conn).findOne(args, function(err, r){
			if(err) return res({system: true});
			if(!editor && r.author !== conn.session.userId)
				return res({noPermission: true});
			res(null, r);
		});
	});
};
