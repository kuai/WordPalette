// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var site = fw.module('db_model').Site;

exports.global = {
	lib: ['lib/jquery.js', 'lib/crypto.js'],
	main: 'global.js',
	style: 'global',
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
		render: 'forestage',
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
	exports['wp.series'] = {
		parent: 'forestage',
		main: 'series',
	};
	exports['wp.author'] = {
		parent: 'forestage',
		main: 'author',
	};
	exports['wp.date'] = {
		parent: 'forestage',
		main: 'author',
	};
	exports['*'] = {
		parent: 'forestage',
		main: 'index',
		render: 'index',
	};
};

if(fw.debug) {
	// themetest, no db required
	exports.themetest = {
		parent: 'global',
		main: 'default_theme/main',
		tmpl: 'default_theme/main',
		style: 'default_theme/main',
		render: 'wp.themetest/main',
	};
	exports['wp.themetest/single'] = {
		parent: 'themetest',
		main: 'default_theme/single',
		tmpl: 'default_theme/single',
		style: 'default_theme/single',
		render: 'wp.themetest/single',
	};
	exports['wp.themetest/'] = {
		parent: 'themetest',
		main: 'default_theme/list',
		tmpl: 'default_theme/list',
		style: 'default_theme/list',
		render: 'wp.themetest/index',
	};
	exports['wp.themetest/search'] = {
		parent: 'themetest',
		main: 'default_theme/list',
		tmpl: 'default_theme/list',
		style: 'default_theme/list',
		render: 'wp.themetest/search',
	};
	exports['wp.themetest/category'] = {
		parent: 'themetest',
		main: 'default_theme/list',
		tmpl: 'default_theme/list',
		style: 'default_theme/list',
		render: 'wp.themetest/category',
	};
	exports['wp.themetest/tag'] = {
		parent: 'themetest',
		main: 'default_theme/list',
		tmpl: 'default_theme/list',
		style: 'default_theme/list',
		render: 'wp.themetest/tag',
	};
	exports['wp.themetest/series'] = {
		parent: 'themetest',
		main: 'default_theme/list',
		tmpl: 'default_theme/list',
		style: 'default_theme/list',
		render: 'wp.themetest/series',
	};
	exports['wp.themetest/author'] = {
		parent: 'themetest',
		main: 'default_theme/list',
		tmpl: 'default_theme/list',
		style: 'default_theme/list',
		render: 'wp.themetest/author',
	};
	exports['wp.themetest/date'] = {
		parent: 'themetest',
		main: 'default_theme/list',
		tmpl: 'default_theme/list',
		style: 'default_theme/list',
		render: 'wp.themetest/date',
	};
}
