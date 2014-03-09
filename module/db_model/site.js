// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var COLLECTION = 'wp._site';

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	domain: { type: [String], index: true },
	_id: String,
};
var schema = new Schema(schemaObj, {autoIndex: false});

// functions
schema.methods.addDomain = function(domain, cb){
	this.domain.push(domain);
	this.save(cb);
};
schema.methods.removeDomain = function(domain, cb){
	for(var i=0; i<this.domain.length; i++)
		if(this.domain[i] === domain)
			this.domain.splice(i--, 1);
	this.save(cb);
};
schema.statics.getId = function(domain, cb){
	this.find({domain: domain}, function(err, res){
		if(err) cb(err);
		else cb(null, res._id);
	});
};
schema.statics.list = function(cb){
	this.find({}, function(err, res){
		if(err) {
			cb(err);
			return;
		}
		var obj = {};
		for(var i=0; i<res.length; i++)
			obj[res[i]._id] = res[i].domain;
		cb(null, obj);
	});
};
var listCache = {};
var listCount = 0;
schema.statics.cachedId = function(domain){
	return listCache[domain];
};
schema.statics.cachedCount = function(){
	return listCount;
};

// register model
module.exports = function(model, next){
	model.Site = fw.db.model(COLLECTION, schema);
	model.Site.ensureIndexes(function(){
		model.Site.find({}, function(err, res){
			if(err) throw(err);
			for(var i=0; i<res.length; i++)
				listCache[res[i]._id] = res[i].domain;
			listCount = res.length;
			next();
		});
	});
};
