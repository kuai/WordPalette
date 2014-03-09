// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var fs = require('fs');

// read config file
var config = {};
try {
	var config = JSON.parse(fs.readFileSync('config.json').toString('utf8'));
} catch(e) {}
var configExists = !!config.secret;

module.exports = {
	app: {
		title: 'WordPalette',
		version: new Date().getTime(),
		locale: ['zh_CN'],
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