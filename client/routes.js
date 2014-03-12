// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var site = fw.module('db_model').Site;

exports.global = {
	lib: ['lib/jquery.js', 'lib/crypto.js'],
};

if(!fw.db) {
	// for installation
	exports['*'] = {
		redirect: './wp.engine/install',
	};
} else if(!site.cachedCount()) {
	// no sites
	exports['*'] = {
		redirect: './wp.engine/',
	};
} else {
	// common
	exports.forestage = {
		parent: 'global',
	};
	exports['wp.search'] = {
		parent: 'forestage',
		main: 'search',
	};
	exports['wp.category'] = {
		parent: 'forestage',
		main: 'category',
	};
	exports['wp.tag'] = {
		parent: 'forestage',
		main: 'tag',
	};
	exports['wp.author'] = {
		parent: 'forestage',
		main: 'author',
	};
	exports['*'] = {
		parent: 'forestage',
		main: 'index',
		render: 'index',
	};
};