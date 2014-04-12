// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

fw.main(function(pg){
	var tmpl = pg.tmpl;
	var _ = tmpl.i18n;

	wp.registerDriver('article', {
		name: _('Article'),
		priority: 10000,
		editor: function(div, data){

			// init editor in div
			$(div).append('<textarea id="tinymce"></textarea>');
			tinymce.init({
				selector: "textarea#tinymce",
				theme: "modern",
				width: 800,
				height: 400,
				plugins: [
					"anchor autoresize charmap code contextmenu hr image link lists searchreplace table textcolor wordcount"
				],
				menubar: "edit insert view format table tools",
				toolbar: "styleselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat", 
				statusbar: false,
				style_formats: [
					{title: 'Heading 1', block: 'h1'},
					{title: 'Heading 2', block: 'h2'},
					{title: 'Heading 3', block: 'h3'},
					{title: 'Blockquote', block: 'blockquote'},
					{title: 'Pre', block: 'pre'},
				],
				content_css: '/~/wp.backstage/drivers/article/main.css',
				language: fw.language
			});
			// TODO

		}
	});
});