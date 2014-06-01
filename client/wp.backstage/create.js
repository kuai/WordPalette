// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	var _ = tmpl.i18n;

	var $btns = $('#content').html(tmpl.main(wp.listDrivers())).find('input');
	$btns.click(function(){
		var $this = $(this);
		var type = $this.attr('driverId');
		$btns.attr('disabled', true);
		pg.rpc('post:create', {type: type}, function(err, id){
			if(err) {
				$btns.removeAttr('disabled');
				return;
			}
			$('#content').html(pg.parent.parent.tmpl.busy());
			fw.go('/wp.backstage/post/' + id);
		}, function(){
			$btns.removeAttr('disabled');
		});
	});
});