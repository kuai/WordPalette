// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	var _ = tmpl.i18n;

	// get post information
	pg.rpc('post:authorGet', {_id: fw.getArgs()['*']}, function(err, r){
		if(err) {
			$('#content').html(tmpl.error(err));
			return;
		}
		var $content = $('#content').html(tmpl.main());
		wp.driverEditor(r.type, $content.find('.driver')[0], r);
	}, function(){
		$('#content').html(tmpl.error({ timeout: true }));
	});
});