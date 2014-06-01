// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var COLLECTION = '.post';

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	type: String,
	path: { type: String, default: '' },
	title: { type: String, default: '' },
	status: { type: String, default: 'draft', enum: [
		'draft', 'pending', 'published'
	] },
	author: String,
	time: { type: Number, index: true },
	category: { type: [String], index: true, default: [] },
	tag: { type: [String], index: true, default: [] },
	series: Schema.Types.ObjectId,
	content: { type: String, default: '' },
	abstract: { type: String, default: '' }
};
var schema = new Schema(schemaObj, {autoIndex: false});

// create models
module.exports = function(model, next){
	var cols = {};
	model.Post = function(conn){
		var site = conn.session.site || model.Site.cachedId(conn.host) || '';
		return cols[site];
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