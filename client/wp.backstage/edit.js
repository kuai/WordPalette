// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	var _ = tmpl.i18n;

	var initPage = function(post){

		// show content
		var $content = $('#content').html(tmpl.main());
		var editor = wp.driverEditor(post.type, $content.find('.driver')[0], post);

		// save
		var $form = $content.find('.editor');
		var $save = $content.find('.editor_save').click(function(){
			$form.submit();
		});
		$form.submit(function(e){
			e.preventDefault();
			// collect args
			var args = {
				_id: post._id
			};
			var dynArgs = editor.get();
			var elems = $form[0].elements;
			for(var i=0; i<elems.length; i++)
				if(elems[i].name)
					args[elems[i].name] = elems[i].value;
			for(var k in dynArgs)
				args[k] = dynArgs[k];
			// rpc
			$save.prop('disabled', true);
			pg.rpc($form.attr('action') + ':' + $form.attr('method'), args, function(err){
				$save.prop('disabled', false);
				if(err) {
					wp.backstage.showError(err);
					return;
				}
			}, function(){
				$save.prop('disabled', false);
				wp.backstage.showError({ timeout: true });
			});
			$save.prop('disabled', true);
		});
	};

	// get post information
	pg.rpc('post:get', {_id: fw.getArgs()['*']}, function(err, r){
		if(err) {
			wp.backstage.showError(err);
			return;
		}
		initPage(r);
	}, function(){
		wp.backstage.showError({ timeout: true });
	});
});