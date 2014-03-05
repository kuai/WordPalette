// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var tmpl = fw.loadTmpl('index.tmpl');
var filename = fw.currentLoading;

module.exports = function(conn, args, childRes, next){
	childRes.title = 'WordPalette';
	childRes.content = tmpl.index(conn);
	next(childRes);
};