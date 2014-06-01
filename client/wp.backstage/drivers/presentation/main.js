// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	var _ = tmpl.i18n;

	wp.registerDriver('presentation', {
		name: _('Presentation'),
		priority: 1000,
	});
});