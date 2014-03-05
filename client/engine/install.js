// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var pg = fw.getPage();
var tmpl = pg.tmpl;

pg.on('load', function(){
	document.getElementById('engine').innerHTML = tmpl.main();
	pg.form(document.getElementById('install'), function(){
		if(document.getElementById('enginePassword').value !== document.getElementById('enginePasswordRe').value) {
			document.getElementById('enginePasswordRe').value = '';
			document.getElementById('enginePasswordRe').focus();
			return false;
		}
		document.getElementById('error').innerHTML = '';
		document.getElementById('submit').disabled = true;
	}, function(err){
		if(!err) {
			pg.on('socketConnect', function(){
				location.reload();
			});
			return;
		}
		document.getElementById('submit').disabled = false;
		document.getElementById('error').innerHTML = tmpl.error(err);
	}, function(){
		document.getElementById('submit').disabled = false;
		document.getElementById('error').innerHTML = tmpl.timeout();
	});
});
