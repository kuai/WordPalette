// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var COLLECTION = '.settings';

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	v: Schema.Types.Mixed,
	_id: String,
};
var schema = new Schema(schemaObj, {autoIndex: false});

// functions
schema.statics.get = function(key, cb){
	this.findOne({_id: key}, function(err, res){
		if(err) cb(err);
		else if(!res) cb(null);
		else cb(null, res.v);
	});
};
schema.statics.set = function(key, value, cb){
	this.update({_id: key}, {v: value}, {upsert: true}, cb);
};

// create models
module.exports = function(model, next){
	var cols = {};
	model.Settings = function(conn){
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