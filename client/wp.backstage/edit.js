// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	var _ = tmpl.i18n;

	// TODO
	pg.rpc('post:editorGet', {_id: fw.getArgs()['*']}, function(err, r){
		wp.driverEditor(r.type, $('#content').html(''), r);
	}, function(){});
});