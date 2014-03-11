// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var pg = fw.getPage();
var tmpl = pg.tmpl;

pg.on('load', function(){
	pg.rpc('password:exists', null, function(res){
		$('#engine').html(tmpl.main({originalPassword: res}));
		pg.form(document.getElementById('password'), function(){
			if($('#enginePassword').val() !== $('#enginePasswordRe').val()) {
				$('#enginePasswordRe').val('').focus();
				return false;
			}
			$('#error').html('');
			$('#submit').prop('disabled', true);
		}, function(err){
			if(!err) {
				fw.go('/wp.engine/');
				return;
			}
			$('#submit').prop('disabled', false);
			$('#error').html(tmpl.error(err));
		}, function(){
			$('#submit').prop('disabled', false);
			$('#error').html(tmpl.timeout());
		});
	});
});
