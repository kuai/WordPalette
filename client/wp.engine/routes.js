// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

module.exports = {
	'./password': {
		parent: 'engine',
		main: 'password',
		tmpl: 'password',
	},
	'./sites': {
		parent: 'engine',
		main: 'sites',
		tmpl: 'sites',
	},
	'./': {
		redirect: './password',
	},
};