// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	wp.tableBuilder.i18n = tmpl.i18n;

	// create div structure
	var wpVersion = fw.version;
	if(wpVersion.indexOf('~') >= 0) wpVersion = wpVersion.slice(0, wpVersion.indexOf('~'));
	var $backstage = $(tmpl.main({
		wpVersion: wpVersion
	})).appendTo(document.body);
	$('#content').html(tmpl.busy());
	// define page switch method
	var $tabs = $backstage.find('#tabs');
	pg.on('childUnload', function(){
		$('#content').html(tmpl.busy());
	});
	pg.on('childLoadStart', function(){
		var path = fw.getPath().match(/^\/[^\/]+\/(\w+)/);
		var tabId = path[1];
		$tabs.find('.tab_current').removeClass('tab_current');
		$tabs.find('.tab_'+tabId).addClass('tab_current');
	});

});