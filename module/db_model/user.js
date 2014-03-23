// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var COLLECTION = '.user';

var TYPEVAL = {
	admin: 5,
	editor: 4,
	writer: 3,
	contributor: 2,
	reader: 1
};

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	id: { type: String, index: true },
	type: { type: String, index: true },
	displayName: String,
	email: String,
	url: { type: String, default: '' },
	description: { type: String, default: '' },
	password: String,
	avatar: { type: String, default: '' }
};
var schema = new Schema(schemaObj, {autoIndex: false});

// create models
module.exports = function(model, next){
	model.User = function(conn){
		var site = model.Site.cachedId(conn.host) || '';
		return cols[site];
	};
	var cols = {};
	for(var i=0; i<model.siteList.length; i++) {
		var site = model.siteList[i];
		var col = 'wp.' + site + COLLECTION;
		cols[site] = fw.db.model(col, schema);
	}

	// an helper to check permission
	model.User.checkPermission = function(conn, type, res){
		var site = model.Site.cachedId(conn.host);
		if(!site) {
			res(false);
			return;
		}
		cols[site].findOne({id: conn.session.userId}).select('type').exec(function(err, r){
			if(err || !r) {
				res(false);
				return;
			}
			if(typeof(type) !== 'object') {
				res(TYPEVAL[r.type] >= TYPEVAL[type]);
			} else {
				var a = [];
				for(var i=0; i<type.length; i++)
					a.push(TYPEVAL[r.type] >= TYPEVAL[type[i]]);
				res.call(global, a);
			}
		});
	};
	next();
};