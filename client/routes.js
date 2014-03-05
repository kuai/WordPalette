// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

if(!fw.db) {
	// for installation
	module.exports = {
		engine: {
			main: 'engine/main',
			style: 'engine/main',
			reload: 'both',
		},
		'/': {
			parent: 'engine',
			main: 'engine/install',
			tmpl: 'engine/install',
		},
	}
} else {
	// common
	module.exports = {
		engine: {
			main: 'engine/main',
			style: 'engine/main',
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
	}
};