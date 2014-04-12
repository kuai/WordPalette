// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

if(fw.db) {
	module.exports = {
		engine: {
			parent: 'global',
			lib: '/lib/jquery.js',
			main: 'main',
			style: 'main',
		},
		'./password': {
			parent: 'engine',
			main: 'password',
			tmpl: 'password',
		},
		'./': {
			parent: 'engine',
			main: 'sites',
			tmpl: 'sites',
		},
	};
} else {
	module.exports = {
		engine: {
			parent: 'global',
			main: 'main',
			style: 'main',
		},
		'./install': {
			parent: 'engine',
			main: 'install',
			tmpl: 'install',
		},
	};
}