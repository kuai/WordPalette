// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var COLLECTION = '.user';

var TYPEVAL = {
	admin: 5,
	editor: 4,
	writer: 3,
	contributor: 2,
	reader: 1,
	disabled: -1
};

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	id: { type: String, index: true },
	type: { type: String, index: true, enum: [
		'disabled', 'reader', 'contributor', 'writer', 'editor', 'admin'
	] },
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
	var cols = {};
	model.User = function(conn){
		var site = conn.session.site || model.Site.cachedId(conn.host) || '';
		return cols[site];
	};

	// an helper to check permission
	model.User.checkPermission = function(conn, type, res){
		var site = conn.session.site;
		if(!site) {
			res(false);
			return;
		}
		cols[site].findOne({id: conn.session.userId}).select('type').exec(function(err, r){
			if(typeof(type) !== 'object') {
				if(err || !r)
					res(false);
				else
					res(TYPEVAL[r.type] >= TYPEVAL[type]);
			} else {
				var a = [];
				for(var i=0; i<type.length; i++)
					if(err || !r)
						a.push(false);
					else
						a.push(TYPEVAL[r.type] >= TYPEVAL[type[i]]);
				res.apply(global, a);
			}
		});
	};
	model.User.typeLevel = function(type){
		return TYPEVAL[type];
	};

	// build models
	var c = model.siteList.length + 1;
	var cb = function(){
		c--;
		if(!c) next();
	};
	for(var i=0; i<model.siteList.length; i++) {
		var site = model.siteList[i];
		var col = 'wp.' + site + COLLECTION;
		cols[site] = fw.db.model(col, schema);
		cols[site].ensureIndexes(cb);
	}
	cb();
};