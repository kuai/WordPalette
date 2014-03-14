// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	type: String,
	title: { type: String },
	status: String,
	author: String,
	time: { type: Number, index: true },
	category: { type: [String], index: true, default: [] },
	tag: { type: [String], index: true, default: [] },
	series: Schema.Type.ObjectId,
	content: { type: String },
	abstract: { type: String },
	thumb: String,
	metadata: {
		key: { type: String, index: true },
		value: Schema.Type.ObjectId
	}
};
var schema = new Schema(schemaObj, {autoIndex: false});

// TODO