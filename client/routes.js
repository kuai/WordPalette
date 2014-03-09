// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var site = fw.module('db_model').Site;

if(!fw.db) {
	// for installation
	module.exports = {
		engine: {
			main: 'wp.engine/main',
			style: 'wp.engine/main',
			reload: 'both',
		},
		'/': {
			parent: 'engine',
			main: 'wp.engine/install',
			tmpl: 'wp.engine/install',
		},
	};
} else if(site.cachedCount) {
	module.exports = {
		engine: {
			main: 'wp.engine/main',
			style: 'wp.engine/main',
			reload: 'both',
		},
		'/': {
			redirect: './wp.engine',
		},
	};
} else {
	// common
	module.exports = {
		engine: {
			main: 'wp.engine/main',
			style: 'wp.engine/main',
			reload: 'both',
		},
		wordpalette: {
			main: 'wordpalette',
			reload: 'both',
		},
		'/': {
			parent: 'wordpalette',
			main: 'index',
			render: 'index',
		},
	};
};