// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	var $users = $('#content').html(tmpl.main()).find('.users');

	var table = wp.tableBuilder($users, {allowAdd: true}, [
		{ id: '_id', type: 'hidden' },
		{ id: 'id', name: 'Username' },
		{ id: 'displayName', name: 'Display Name' },
		{ id: 'type', name: 'Type', input: {
			admin: 'admin',
			editor: 'editor',
			writer: 'writer',
			contributor: 'contributor',
			reader: 'reader'
		} },
		{ id: 'email', name: 'Email' },
		{ id: 'url', name: 'URL' },
		{ id: 'password', name: 'Password', input: 'password' },
		{ id: 'description', name: 'Description', type: 'extra' }
	])
	.data(function(page){})
	.currentPage(1, 3);

	table.set([
		{ _id: '1', id: 1, displayName: '1234567890', type: 'admin', email: '1234567890@xxx.xxx', url: 'http://mistymiracle.org/lastleaf', description: '12345678901234567890123456789012345678901234567890'},
		{ _id: '2', id: 1, displayName: '1234567890', type: 'admin', email: '1234567890@xxx.xxx', url: 'http://mistymiracle.org/lastleaf', description: '12345678901234567890123456789012345678901234567890'},
		{ _id: '3', id: 1, displayName: '1234567890', type: 'admin', email: '1234567890@xxx.xxx', url: 'http://mistymiracle.org/lastleaf', description: '12345678901234567890123456789012345678901234567890'}
	]);
});