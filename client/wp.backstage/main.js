// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	wp.tableBuilder.i18n = tmpl.i18n;
	wp.backstage = {};

	// create div structure
	var wpVersion = fw.version;
	if(wpVersion.indexOf('~') >= 0) wpVersion = wpVersion.slice(0, wpVersion.indexOf('~'));
	var $backstage = $(tmpl.main()).appendTo(document.body);
	$('#content').html(tmpl.busy());
	// define page switch method
	var $tabbar = $backstage.find('#tabbar');
	pg.on('childUnload', function(){
		$('#content').html(tmpl.busy());
	});
	var showCurStyle = function(){
		var path = fw.getPath().match(/^\/[^\/]+\/(\w+)/);
		var tabId = path[1];
		$tabbar.find('.tab_current').removeClass('tab_current');
		$tabbar.find('.tab_'+tabId).addClass('tab_current');
	};
	pg.on('childLoadStart', showCurStyle);

	// capture the height of page
	$(window).resize(function(){
		$('#backstage').height(document.documentElement.clientHeight);
	});
	$('#backstage').height(document.documentElement.clientHeight);

	// show error
	var $errors = $('#errors');
	wp.backstage.showError = function(err){
		var hidden = false;
		if(typeof(err) === 'object') err = tmpl.error(err);
		var $error = $('<div></div>').text(err).appendTo($errors).hide().fadeIn(200).click(function(){
			if(hidden) return;
			hidden = true;
			$error.fadeOut(200, function(){
				$error.remove();
			});
		});
	};

	// send an rpc to get the user's type
	pg.rpc('user:current', function(info){
		// show tabbar
		if(info.type === 'admin') {
			var html = tmpl.userTabs({ contrib: true, write: true, admin: true });
		} else if(info.type === 'editor' || info.type === 'writer') {
			var html = tmpl.userTabs({ contrib: true, write: true });
		} else if(info.type === 'contributor') {
			var html = tmpl.userTabs({ contrib: true });
		} else {
			var html = tmpl.userTabs();
		}
		$('#tabbar').html(html);
		showCurStyle();
		// show user bar
		if(info.id)
			$('.header_right').html(tmpl.userInfo(info))
				.find('.logout').click(function(e){
					e.preventDefault();
					wp.logout(function(){
						location.href = '/wp.backstage/home';
					});
				});
		// raise an event to notify child pages
		pg.userInfo = info;
		pg.emit('userInfoReady');
	});
});