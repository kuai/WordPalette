// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var pg = fw.getPage();
var tmpl = pg.tmpl;

pg.on('load', function(){
	pg.rpc('password:exists', null, function(res){
		document.getElementById('engine').innerHTML = tmpl.main({originalPassword: res});
		pg.form(document.getElementById('password'), function(){
			if(document.getElementById('enginePassword').value !== document.getElementById('enginePasswordRe').value) {
				document.getElementById('enginePasswordRe').value = '';
				document.getElementById('enginePasswordRe').focus();
				return false;
			}
			document.getElementById('error').innerHTML = '';
			document.getElementById('submit').disabled = true;
		}, function(err){
			if(!err) {
				fw.go('/wp.engine/');
				return;
			}
			document.getElementById('submit').disabled = false;
			document.getElementById('error').innerHTML = tmpl.error(err);
		}, function(){
			document.getElementById('submit').disabled = false;
			document.getElementById('error').innerHTML = tmpl.timeout();
		});
	});
});
