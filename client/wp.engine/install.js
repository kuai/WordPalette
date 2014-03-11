// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var pg = fw.getPage();
var tmpl = pg.tmpl;

pg.on('load', function(){
	$('#engine').html(tmpl.main());
	pg.form($('#install')[0], function(){
		if($('#enginePassword').val() !== $('#enginePasswordRe').val()) {
			$('#enginePasswordRe').val('').focus();
			return false;
		}
		$('#error').html('');
		$('#submit').prop('disabled', true);
	}, function(err){
		if(!err) {
			pg.on('socketConnect', function(){
				location.reload();
			});
			return;
		}
		$('#submit').prop('disabled', false);
		$('#error').html(tmpl.error(err));
	}, function(){
		$('#submit').prop('disabled', false);
		$('#error').html(tmpl.timeout());
	});
});
