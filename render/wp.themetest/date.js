// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var tmpl = fw.tmpl('list.tmpl');

module.exports = function(conn, args, childRes, next){
	childRes.title = tmpl.title(conn, {
		date: true,
		keyword: 'Jan 1, 2014'
	});
	childRes.content = tmpl.index(conn, {
		date: true,
		keyword: 'Jan 1, 2014'
	});
	next(childRes);
};