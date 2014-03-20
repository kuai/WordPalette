// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var COLLECTION = 'wp._site';

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	domain: { type: [String], index: true, default: [] },
	_id: String,
};
var schema = new Schema(schemaObj, {autoIndex: false});

// functions
schema.statics.getList = function(cb){
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
schema.statics.setList = function(list, cb){
	var Site = this;
	this.remove({}, function(err){
		if(err) {
			cb(err);
			return;
		}
		var c = 0;
		for(var k in list) c++;
		var done = function(){
			c--;
			if(!c) cb();
		};
		if(!c)
			cb();
		else
			for(var k in list)
				new Site({
					_id: k,
					domain: list[k],
				}).save(done);
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
			var siteList = [];
			for(var i=0; i<res.length; i++) {
				var id = res[i]._id;
				siteList.push(id);
				var domain = res[i].domain;
				for(var j=0; j<domain.length; j++)
					listCache[domain[j]] = id;
				listCount += domain.length;
			}
			model.siteList = siteList;
			next();
		});
	});
};
