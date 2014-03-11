// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var pg = fw.getPage();
var tmpl = pg.tmpl;

var showMain = function(res){
	document.getElementById('engine').innerHTML = tmpl.main(res);
	// new
	document.getElementById('newSite').onclick = function(){
		var name = document.getElementById('newSiteName');
		if(!name.value.match(/^\w+$/)) {
			name.value = '';
			name.focus();
			return;
		}
		var div = document.createElement('div');
		div.innerHTML = tmpl.newSite(name.value);
		document.getElementById('sites').appendChild(div);
		document.getElementById('sites').appendChild(document.createElement('hr'));
		document.getElementById('removeSite-'+name.value).onclick = function(){
			this.parentElement.innerHTML = tmpl.removeSite();
		};
		name.value = '';
	};
	// delete
	// TODO
	// form
	bindSettings(function(){
		pg.on('socketConnect', function(){
			location.reload();
		});
		return;
	});
};

var bindSettings = function(cb){
	pg.form(document.getElementById('settings'), function(){
		document.getElementById('error').innerHTML = '';
		document.getElementById('submit').disabled = true;
	}, function(err, res){
		if(!err) return cb(res);
		document.getElementById('submit').disabled = false;
		document.getElementById('error').innerHTML = tmpl.error(err);
	}, function(){
		document.getElementById('submit').disabled = false;
		document.getElementById('error').innerHTML = tmpl.timeout();
	});
};

pg.on('load', function(){
	pg.rpc('password:exists', null, function(res){
		if(!res) return fw.go('/wp.engine/password');
		document.getElementById('engine').innerHTML = tmpl.login();
		bindSettings(function(res){
			showMain(res);
		});
	});
});
