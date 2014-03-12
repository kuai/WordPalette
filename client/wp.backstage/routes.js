// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

if(fw.db) {
	module.exports = {
		backstage: {
			parent: 'global',
			main: 'main',
			style: 'main',
		},
		'./': {
			parent: 'backstage',
			main: 'index',
			tmpl: 'index',
		},
		'./posts': {
			parent: 'backstage',
			main: 'posts',
			tmpl: 'posts',
		},
		'./post/:id': {
			parent: 'backstage',
			main: 'post',
			tmpl: 'post',
		},
		'./comments': {
			parent: 'backstage',
			main: 'comments',
			tmpl: 'comments',
		},
		'./uploads': {
			parent: 'backstage',
			main: 'uploads',
			tmpl: 'uploads',
		},
		'./users': {
			parent: 'backstage',
			main: 'users',
			tmpl: 'users',
		},
		'./user/:id': {
			parent: 'backstage',
			main: 'users',
			tmpl: 'users',
		},
		'./settings': {
			parent: 'backstage',
			main: 'settings',
			tmpl: 'settings',
		},
	};
}