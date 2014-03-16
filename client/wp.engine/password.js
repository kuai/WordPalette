// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
var tmpl = pg.tmpl;

pg.on('load', function(){
	pg.rpc('password:exists', null, function(res){
		$('#engine').html(tmpl.main({originalPassword: res}));
		var $form = $('#password');
		pg.form($form[0], function(){
			if($('#enginePassword').val() !== $('#enginePasswordRe').val()) {
				$('#enginePasswordRe').val('').focus();
				return false;
			}
			$form.find('[name=originalPassword]').val(
				CryptoJS.SHA256($('#originalPassword').val()).toString()
			);
			$form.find('[name=enginePassword]').val(
				CryptoJS.SHA256($('#enginePassword').val()).toString()
			);
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

});