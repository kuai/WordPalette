// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

var EMAIL_REGEXP = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\\\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

var fs = require('fs');
var PNG = require('pngjs').PNG;
var password = fw.module('password');
var formFilter = fw.module('form_filter');
var Settings = fw.module('db_model').Settings;
var Site = fw.module('db_model').Site;
var User = fw.module('db_model').User;
var mail = fw.module('mail');

var tmpl = fw.tmpl('user.tmpl');
var _ = tmpl.i18n;

// returns the user infomation object of current session
exports.current = function(conn, res, args){
	var id = conn.session.userId;
	var user = User(conn);
	if(!id || !user) return res({});
	user.findOne({id: id}, function(err, r){
		if(err || !r) return res({});
		r.password = !!r.password;
		return res(r);
	});
};

// register an user with id, email and password provided
exports.register = function(conn, res, args){
	// filter data
	args = formFilter(args, {
		id: '',
		password: '',
		email: ''
	});
	if(!args.id.match(/^[-\w]{4,32}$/i)) return res({idIllegal: true});
	if(args.email.length > 64 || !args.email.match(EMAIL_REGEXP)) return res({emailIllegal: true});
	if(args.password.length !== 64) return res({pwd: true});
	// check db status
	var user = User(conn);
	if(!user) return res({system: true});
	// determine user type
	user.count({type: 'admin'}, function(err, count){
		if(count) args.type = 'reader';
		else args.type = 'admin';
		// set deault args
		args.displayName = args.id;
		args.id = args.id.toLowerCase();
		password.hash(args.password, function(err, r){
			if(err) return res({system: true});
			args.password = r;
			// check user exists
			user.findOne({id: args.id}, function(err, r){
				if(err) return res({system: true});
				if(r) return res({idUsed: true});
				user.update({id: args.id}, args, {upsert: true}, function(err){
					if(err) return res({system: true});
					res();
					if(args.type === 'admin') return;
					// send mail to readers
					Settings(conn).get('basic', function(err, r){
						if(err || !r) return;
						var siteTitle = r.siteTitle;
						Settings(conn).get('email', function(err, r){
							if(err || !r) return;
							var mailOptions = r;
							disablePath(args.id, args.email, function(err, r){
								var content = tmpl.regEmail(conn, {
									siteTitle: siteTitle,
									host: conn.host,
									username: args.id,
									email: args.email,
									disablePath: r
								});
								mail(mailOptions, args.displayName, args.email, _(conn, 'Welcome to ') + siteTitle, content);
							});
						});
					});
				});
			});
		});
	});
};

// login with id and password
exports.login = function(conn, res, args){
	// filter data
	args = formFilter(args, {
		id: '',
		password: ''
	});
	if(!args.id.match(/^[-\w]{4,32}$/i)) return res({idIllegal: true});
	var id = args.id.toLowerCase();
	// check db status
	if(conn.session.site || conn.session.userId) return res({loggedIn: true});
	var user = User(conn);
	if(!user) return res({system: true});
	// check password
	user.findOne({id: id}).select('type password').exec(function(err, r){
		if(err) return res({system: true});
		if(!r) return res({idNull: true});
		if(r.type === 'disabled') return res({idDisabled: true});
		if(!password.check(args.password, r.password)) return res({pwd: true});
		conn.session.site = Site.cachedId(conn.host);
		conn.session.userId = id;
		conn.session.save(function(){
			res();
		});
	});
};

// login with id and password
exports.logout = function(conn, res, args){
	if(!conn.session.userId) return res({noLogin: true});
	delete conn.session.site;
	delete conn.session.userId;
	conn.session.save(function(){
		res();
	});
};

// modify the current user (except for id, email and password)
exports.modify = function(conn, res, args){
	// filter data
	args = formFilter(args, {
		displayName: '',
		url: ''
	});
	if(args.displayName.length <= 0 || args.displayName.length > 32) return res({displayNameIllegal: true});
	if(!args.url.match(/^https?:\/\//)) args.url = 'http://' + args.url;
	if(args.url.length > 256) return res({urlIllegal: true});
	// check login status
	User.checkPermission(conn, 'reader', function(r){
		if(!r) return res({noPermission: true});
		User(conn).update({id: conn.session.userId}, args, function(err){
			if(err) return res({system: true});
			res();
		});
	});
};

// modify the current user's password
exports.modifyPassword = function(conn, res, args){
	// filter data
	args = formFilter(args, {
		original: '',
		password: ''
	});
	if(args.original.length !== 64 || args.password.length !== 64) return res({pwd: true});
	// check login status
	User.checkPermission(conn, 'reader', function(r){
		if(!r) return res({noPermission: true});
		User(conn).findOne({id: conn.session.userId}).select('password').exec(function(err, r){
			if(err) return res({system: true});
			if(!password.check(args.original, r.password)) return res({pwd: true});
			password.hash(args.password, function(err, r){
				if(err) return res({system: true});
				User(conn).update({id: conn.session.userId}, {password: r}, function(){
					if(err) return res({system: true});
					res();
				});
			});
		});
	});
};

// set current user's custom avatar
exports.avatar = function(conn, res, dataUrl){
	if(typeof(dataUrl) !== 'string' || dataUrl.length >= 100000) return res({system: true});
	User.checkPermission(conn, 'reader', function(r){
		if(!r) return res({noPermission: true});
		if(!dataUrl) {
			// delete avatar
			User(conn).update({id: conn.session.userId}, {avatar: ''}, function(err){
				if(err) return res({system: true});
				var dir = Site.dir(conn, 'avatars') + conn.session.userId;
				res();
				var c = 3;
				var cb = function(){
					c--;
					if(!c) fs.rmdir(dir);
				};
				fs.unlink(dir + '/128.png', cb);
				fs.unlink(dir + '/64.png', cb);
				fs.unlink(dir + '/32.png', cb);
			});
			return;
		}
		var data = dataUrl.split(',', 2);
		if(data[0] !== 'data:image/png;base64') return res({system: true});
		try {
			var buf = new Buffer(data[1], 'base64');
			// save original image
			var dir = Site.dir(conn, 'avatars') + conn.session.userId;
			fs.mkdir(dir, function(err){
				var file = dir + '/128.png';
				fs.writeFile(file, buf, function(err){
					if(err) return res({system: true});
					// resize
					avatarResizer(dir, function(err){
						if(err) return res({system: true});
						// save to db
						User(conn).update({id: conn.session.userId}, {avatar: dir.slice(dir.indexOf('/', 2))}, function(err){
							if(err) return res({system: true});
							res();
						});
					});
				});
			});
		} catch(e) {
			res({system: true});
		}
	});
};

// avatar resizer
var avatarResizer = function(dir, cb){
	var smaller = function(img, size){
		var width = size/2;
		var small = new PNG({ width: width, height: width });
		for(var i=0; i<width; i++)
			for(var j=0; j<width; j++) {
				var p = (width * i + j) * 4;
				var q = (size * i + j) * 8;
				var a0 = img.data[q+3];
				var a1 = img.data[q+7];
				var a2 = img.data[q+size*4+3];
				var a3 = img.data[q+size*4+7];
				var a = a0 + a1 + a2 + a3;
				small.data[p+0] = (img.data[q+0]*a0 + img.data[q+4]*a1 + img.data[q+size*4+0]*a2 + img.data[q+size*4+4]*a3) / a;
				small.data[p+1] = (img.data[q+1]*a0 + img.data[q+5]*a1 + img.data[q+size*4+1]*a2 + img.data[q+size*4+5]*a3) / a;
				small.data[p+2] = (img.data[q+2]*a0 + img.data[q+6]*a1 + img.data[q+size*4+2]*a2 + img.data[q+size*4+6]*a3) / a;
				small.data[p+3] = a / 4;
			}
		return small;
	};
	fs.createReadStream(dir + '/128.png').pipe(new PNG()).on('parsed', function(){
		var img64 = smaller(this, 128);
		var stream = fs.createWriteStream(dir + '/64.png');
		stream.on('finish', function(){
			var img32 = smaller(img64, 64);
			var stream = fs.createWriteStream(dir + '/32.png');
			stream.on('finish', cb);
			img32.pack().pipe(stream);
		});
		img64.pack().pipe(stream);
	});
};

// disable an account from email link
exports.disable = function(conn, res, args){
	// filter data
	args = formFilter(args, {
		id: '',
		email: '',
		sign: '',
	});
	if(!args.id.match(/^[-\w]{4,32}$/i)) return res({idIllegal: true});
	if(args.email.length > 64 || !args.email.match(EMAIL_REGEXP)) return res({emailIllegal: true});
	if(!password.check(args.id+'|'+args.email+'|'+fw.config.secret.cookie, args.sign)) return res({system: true});
	// check db status
	var user = User(conn);
	if(!user) return res({system: true});
	// check sign
	user.update({id: args.id}, {type: 'disabled'}, function(err){
		if(err) return res({system: true});
		res();
	});
};

// generate a disable url for email
var disablePath = function(id, email, cb){
	password.hash(id+'|'+email+'|'+fw.config.secret.cookie, function(err, r){
		cb(err, '/wp.user/disable?i=' + id + '&e=' + encodeURIComponent(email) + '&s=' + encodeURIComponent(r));
	});
};