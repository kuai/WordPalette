// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

// define schema
var Schema = fw.db.Schema;
var schemaObj = {
	user: String,
	displayName: String,
	email: String,
	url: String,
	content: String,
	response: Schema.Types.ObjectId,
};
var schema = new Schema(schemaObj, {autoIndex: false});

// TODO