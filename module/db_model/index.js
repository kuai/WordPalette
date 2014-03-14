// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var models = [
	'engine_settings.js',
	'site.js',
	//'settings.js',
	//'user.js',
	//'post.js',
	//'comment.js'
];

module.exports = function(next){
	var model = {};
	if(fw.db) {
		var c = models.length;
		var finished = function(){
			c--;
			if(!c) next(model);
		};
		while(models.length)
			require('./'+models.shift())(model, finished);
	} else {
		next(model);
	}
};
