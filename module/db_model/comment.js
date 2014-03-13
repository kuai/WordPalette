// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	id: String,
	type: String,
	displayName: String,
	email: String,
	url: String,
	description: String,
	password: String,
};
var schema = new Schema(schemaObj, {autoIndex: false});

// TODO