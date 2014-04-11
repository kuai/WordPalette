// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	// init
	window.wp = {};
	pg.on('childLoadEnd', function(){
		fw.loadingLogo.disabled = true;
	});

	// gravatar helper
	wp.gravatarUrl = function(email, size, def){
		var url = 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(email) + '?d=' + encodeURIComponent(def || 'mm');
		if(size) url += '&s=' + size;
		return url;
	};
	
	// login/out helper
	wp.register = function(id, password, email, cb){
		cb = cb || function(){};
		pg.rpc('/wp.backstage/user:register', { id: id, password: CryptoJS.SHA256(id.toLowerCase()+'|'+password), email: email }, function(err){
			if(err) cb(err);
			else {
				cb();
			}
		}, function(){
			cb({timeout: true});
		});
	};
	wp.login = function(id, password, cb){
		cb = cb || function(){};
		pg.rpc('/wp.backstage/user:login', { id: id, password: CryptoJS.SHA256(id.toLowerCase()+'|'+password) }, function(err){
			if(err) cb(err);
			else {
				cb();
				setTimeout(function(){
					location.reload();
				}, 0);
			}
		}, function(){
			cb({timeout: true});
		});
	};
	wp.logout = function(cb){
		cb = cb || function(){};
		pg.rpc('/wp.backstage/user:logout', function(err){
			if(err) cb(err);
			else {
				cb();
				setTimeout(function(){
					location.reload();
				}, 0);
			}
		}, function(){
			cb({timeout: true});
		});
	};
});