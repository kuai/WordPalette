// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var fs = require('fs');

// read config file
var config = {};
try {
	var config = JSON.parse(fs.readFileSync('wordpalette.json').toString('utf8'));
} catch(e) {}
var configExists = !!config.enginePassword;

module.exports = {
	app: {
		title: 'WordPalette',
		version: new Date().getTime(),
		locale: ['zh'],
	},
	server: {
		port: 1180,
	},
	db: {
		type: configExists ? 'mongodb' : 'none',
		host: config.dbHost || 'localhost',
		port: config.dbPort || 27017,
		user: config.dbUser,
		password: config.dbPassword,
		name: config.dbName,
	},
	secret: {
		cookie: config.secret || 'NO SECRET',
	},
};