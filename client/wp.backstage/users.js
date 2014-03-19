// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	var _ = tmpl.i18n;

	var table = wp.tableBuilder($('#content').html(''), {}, [
		{ id: '_id', type: 'hidden' },
		{ id: 'id', name: _('Username'), input: 'add' },
		{ id: 'displayName', name: _('Display Name') },
		{ id: 'type', name: _('Type'), input: {
			admin: _('admin'),
			editor: _('editor'),
			writer: _('writer'),
			contributor: _('contributor'),
			reader: _('reader')
		} },
		{ id: 'email', name: _('Email') },
		{ id: 'url', name: _('URL') },
		{ id: 'password', name: _('Password'), input: 'password' },
		{ id: 'description', type: 'extra' }
	], {
		type: _('reader')
	})
	.data(function(page){
		table.set([
			{ _id: '1', id: 1, displayName: '1234567890', type: _('admin'), email: '1234567890@xxx.xxx', url: 'http://mistymiracle.org/lastleaf', description: '12345678901234567890123456789012345678901234567890'},
			{ _id: '2', id: 1, displayName: '1234567890', type: _('admin'), email: '1234567890@xxx.xxx', url: 'http://mistymiracle.org/lastleaf', description: '12345678901234567890123456789012345678901234567890'},
			{ _id: '3', id: 1, displayName: '1234567890', type: _('admin'), email: '1234567890@xxx.xxx', url: 'http://mistymiracle.org/lastleaf', description: '12345678901234567890123456789012345678901234567890'}
		]);
		setTimeout(function(){
			table.setRow(2, { _id: '2', id: 2, displayName: '1111', type: _('writer'), email: '1234567890@xxx.xxx', url: 'http://mistymiracle.org/lastleaf'});
		}, 2000);
	})
	.setPage(1, 3);

	table.add(function(data){
		console.info(data);
	});
	table.change(function(data){
		console.info(data);
	});
	table.remove(function(id){
		console.info(id);
	});
});