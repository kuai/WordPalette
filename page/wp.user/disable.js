// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var tmpl = fw.tmpl('disable.tmpl');

module.exports = function(req, res){
	req.conn.rpc('/wp.backstage/user:disable', {
		id: req.query.i || '',
		email: req.query.e || '',
		sign: req.query.s || '',
	}, function(err){
		if(err) res.send(403);
		else res.send(200, tmpl.done(req.conn));
	});
};