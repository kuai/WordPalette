// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var tmpl = fw.tmpl('main.tmpl');

module.exports = function(conn, args, childRes, next){
	childRes.title += ' | WordPalette';
	childRes.content = tmpl.index(conn, {content: childRes.content});
	next(childRes);
};