// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var models = [
	'site.js',
];

module.exports = function(next){
	if(fw.db) {
		fw.model = {};
		var c = models.length;
		var finished = function(){
			c--;
			if(!c) next();
		};
		while(models.length)
			require('./'+models.shift())(fw.model, finished);
	} else {
		next();
	}
};
