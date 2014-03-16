// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

if(fw.db) {
	module.exports = {
		backstage: {
			parent: 'global',
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
		'./post/:id': {
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