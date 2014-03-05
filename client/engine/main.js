// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var pg = fw.getPage();
var tmpl = pg.tmpl;

var div = null;
pg.on('load', function(){
	div = document.createElement('div');
	div.id = 'engine';
	document.body.appendChild(div);
});
pg.on('childUnload', function(){
	div.innerHTML = '';
});