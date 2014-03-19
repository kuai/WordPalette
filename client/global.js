// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	window.wp = {};
	pg.on('childLoadEnd', function(){
		fw.loadingLogo.disabled = true;
	});
});