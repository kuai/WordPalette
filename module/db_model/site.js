// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	domain: { type: [String], index: true },
	id: String,
};
var schema = new Schema(schemaObj, {autoIndex: false});

// methods
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

// register model
module.exports = function(model, next){
	model.Site = fw.db.model('wp.site', schema);
	model.Site.ensureIndexes(next);
};
