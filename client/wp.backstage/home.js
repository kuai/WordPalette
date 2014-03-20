// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;

	var showPage = function(){
		if(pg.destroyed) return;
		var userInfo = pg.parent.userInfo;
		if(!userInfo.id) {
			var $content = $('#content').html(tmpl.login());
			$content.find('form').each(function(){
				var $form = $(this);
				pg.form(this, function(){
					if($form.find('.passwordRe').length) {
						if($form.find('.passwordRe').val() !== $form.find('.password').val()) {
							$form.find('.passwordRe').val('').focus();
							return false;
						}
					}
					if($form.find('.password').val())
						$form.find('[name=password]').val(
							CryptoJS.SHA256($form.find('.password').val())
						);
					$form.find('[type=submit]').prop('disabled', true);
				}, function(err){
					if(err) {
						$form.find('[type=submit]').prop('disabled', false);
						return;
					}
					location.reload();
				}, function(){
					$form.find('[type=submit]').prop('disabled', false);
					// TODO
				});
			});
		} else {
			$('#content').html(tmpl.main(userInfo))
				.find('.gravatar').prop('src', wp.gravatarUrl(userInfo.email, 256));
		}
	};

	if(pg.parent.userInfo) {
		showPage();
	} else {
		pg.parent.on('userInfoReady', showPage);
	}
});