// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var COLLECTION = 'wp._settings';

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	v: String,
	_id: String,
};
var schema = new Schema(schemaObj, {autoIndex: false});

// functions
schema.statics.get = function(key, cb){
	this.findOne({_id: key}, function(err, res){
		if(err) cb(err);
		else cb(null, res && res.v);
	});
};
schema.statics.set = function(key, value, cb){
	var model = this.model(COLLECTION);
	this.findOne({_id: key}, function(err, res){
		if(err) {
			cb(err);
			return;
		}
		if(res) {
			res.v = value;
			res.save(cb);
		} else {
			new model({
				_id: key,
				v: value
			}).save(cb);
		}
	});
};

// register model
module.exports = function(model, next){
	model.EngineSettings = fw.db.model(COLLECTION, schema);
	model.EngineSettings.ensureIndexes(next);
};
