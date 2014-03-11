// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var pg = fw.getPage();
var tmpl = pg.tmpl;

var showMain = function(res){
	$('#engine').html(tmpl.main(res));
	// new
	$('#newSite').on('click', function(){
		var $name = $('#newSiteName');
		var val = $name.val();
		if(!val.match(/^\w+$/) || $('#settings [name='+val+']').length) {
			$name.val('').focus();
			return;
		}
		$(tmpl.newSite(val)).insertBefore('#newSiteSection').hide().slideDown(200);
		$name.val('');
	});
	// delete
	$('#settings').on('click', '.removeSite', function(){
		$(this).closest('.siteSection')
			.slideUp(200, function(){
				$(this).remove();
			});
	});
	// discard
	$('#discard').on('click', function(){
		showMain(res);
	});
	// form
	bindSettings(function(){
		pg.on('socketConnect', function(){
			location.reload();
		});
		return;
	});
};

var bindSettings = function(cb){
	pg.form($('#settings')[0], function(){
		$('#error').html('');
		$('#submit').prop('disabled', true);
	}, function(err, res){
		if(!err) return cb(res);
		$('#error').html(tmpl.error(err));
		$('#submit').prop('disabled', false);
	}, function(){
		$('#error').html(tmpl.timeout());
		$('#submit').prop('disabled', false);
	});
};

pg.on('load', function(){
	pg.rpc('password:exists', null, function(res){
		if(!res) return fw.go('/wp.engine/password');
		$('#engine').html(tmpl.login());
		$('#modifyPassword').on('click', function(){
			fw.go('/wp.engine/password');
		});
		bindSettings(function(res){
			showMain(res);
		});
	});
});
