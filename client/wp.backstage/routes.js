// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

if(fw.db) {
	module.exports = {
		backstage: {
			parent: 'global',
			lib: 'table_builder',
			main: 'main',
			tmpl: 'main',
			style: 'main.css',
		},
		'./': {
			redirect: 'home',
		},
		'./home': {
			parent: 'backstage',
			main: 'home',
			tmpl: 'home',
			style: 'home.css',
		},
		'./stat': {
			parent: 'backstage',
			main: 'stat',
			tmpl: 'stat',
		},
		'./posts': {
			parent: 'backstage',
			main: 'posts',
			tmpl: 'posts',
		},
		'./post': {
			parent: 'backstage',
			main: 'create',
			tmpl: 'create',
		},
		'./post/*': {
			parent: 'backstage',
			main: 'edit',
			tmpl: 'edit',
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