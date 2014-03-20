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
});