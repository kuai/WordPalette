// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	var _ = tmpl.i18n;

	var showPage = function(){
		if(pg.destroyed) return;
		var userInfo = pg.parent.userInfo;
		if(!userInfo.id) {
			// login page
			var $content = $('#content').html(tmpl.login());
			// section switch
			$content.find('.section_title a').click(function(e){
				e.preventDefault();
				var $section = $(this).closest('.section');
				if(!$section.hasClass('section_folded')) return;
				$section.parent().children('.section:not(.section_folded)').addClass('section_folded')
					.children('form').slideUp(200, function(){
						$section.removeClass('section_folded').children('form').slideDown(200);
					});
			});
			$content.find('.section_folded>form').hide();
			// submit forms
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
						$form.find('.error').html(tmpl.error(err));
						return;
					}
					$('.home_login').fadeOut(200, function(){
						$('#content').html(tmpl.success());
						setTimeout(function(){
							location.pathname = '/wp.backstage/home';
						}, 3000);
					});
				}, function(){
					$form.find('[type=submit]').prop('disabled', false);
					$form.find('.error').html(tmpl.error({ timeout: true }));
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