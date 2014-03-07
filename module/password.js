// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var crypto = require('crypto');

module.exports = function(next){
	fw.password = {
		hash: function(str, cb){
			crypto.randomBytes(24, function(err, res){
				
			});
		},
		check: function(str, auth){}
	};
	next();
};
