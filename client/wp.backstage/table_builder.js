// Copyright 2014 LastLeaf, LICENSE: github.lastleaf.me/MIT
'use strict';

wp.tableBuilder = function($div, options, colDefine){
	var idCol = options.idCol || '_id';
	var allowAdd = !!options.allowAdd;

	// events
	var events = {};
	var bind = function(e, func){
		if(!events[e]) events[e] = [func];
		else events[e].push(func);
	};
	var trigger = function(e){
		var a = events[e];
		var args = [];
		for(var i=0; i<arguments.length; i++)
			args.push[arguments[i]];
		for(var i=0; i<a.length; i++)
			a[i].apply(that, args);
	};

	// build dom structure
	var $table = $('<table cellpadding="0" cellspacing="0" border="0" class="wp_table"><thead></thead><tbody></tbody><tfoot></tfoot></table>').appendTo($div);
	var $thead = $table.children('thead');
	var $tbody = $table.children('tbody');
	var $tfoot = $table.children('tfoot');
	var $theadTr = $('<tr></tr>').appendTo('thead');
	var colCount = 0;
	for(var i=0; i<colDefine.length; i++) {
		var col = colDefine[i];
		if(col.type === 'hidden' || col.type === 'extra') continue;
		colCount++;
		$('<th></th>').text(col.name).appendTo($theadTr);
	}
	var $navi = $('<tr><th colspan="'+colCount+'" class="wp_table_navi"></th></tr>').appendTo($tfoot).find('th');
	if(allowAdd)
		$('<div class="wp_table_add"><input type="button" value="+"></div>')
			.appendTo($navi)
			.click(function(){
				// TODO
			});
	var $page = $('<div class="wp_table_page"></div>').appendTo($navi);

	// input events
	$tbody.on('click', '.wp_table_row', function(){
		if(this.wpTableEditing) return;
		this.wpTableEditing = true;
		// enter edit mode
		var $tr = $(this).next().andSelf();
		$tr.children('td').each(function(){
			var colId = this.wpTableColId;
			var type = this.wpTableInput;
			if(typeof(type) === 'object') {
				// select
				var $input = $('<select name="'+colId+'"></select>');
				for(var k in type)
					$('<option value="'+k+'"></option>').text(type[k]).appendTo($input);
				$input.val(this.wpTableData);
			} else if(type === 'password') {
				// password
				var $input = $('<input type="password" name="'+colId+'">');
			} else if(type !== false) {
				// text
				var $input = $('<input type="text" name="'+colId+'">').val(this.wpTableData);
			}
			$(this).html('').append($input);
		});
	});

	// data control
	var rowContent = function(id, data){
		var $tr = $tbody.children('[rowId="'+id+'"]').html('');
		if(!$tr.length)
			$tr = $('<tr class="wp_table_row" rowId="'+id+'"></tr><tr rowId="'+id+'" class="wp_table_extra"></tr>').appendTo($tbody);
		for(var i=0; i<colDefine.length; i++) {
			var col = colDefine[i];
			if(col.type === 'hidden') continue;
			if(col.type === 'extra') {
				var $td = $('<td colspan="'+colCount+'"></td>').text(data[col.id]).appendTo($tr[1]);
			} else {
				var $td = $('<td></td>').text(data[col.id]).appendTo($tr[0]);
			}
			$td.prop('wpTableColId', col.id).prop('wpTableInput', col.input).prop('wpTableData', data[col.id]);
		}
	};
	var updateTable = function(dataArray){
		$tbody.html('');
		for(var i=0; i<dataArray.length; i++) {
			var data = dataArray[i];
			var id = data[idCol];
			rowContent(id, data);
		}
	};
	var setRow = function(id, data){
		rowContent(id, data);
		return this;
	};

	// page control
	var pagePos = 0;
	var pageTotal = 0;
	var updateNavi = function(){
		if(pagePos > 0 && pagePos < pageTotal - 1)
			$page.html('<input type="button" value="&lt;"> '+(pagePos+1)+' / '+pageTotal+' <input type="button" value="&gt;">');
		else if(pagePos < pageTotal - 1)
			$page.html((pagePos+1)+' / '+pageTotal+' <input type="button" value="&gt;">');
		else if(pagePos > 0)
			$page.html('<input type="button" value="&lt;"> '+(pagePos+1)+' / '+pageTotal);
		else
			$page.html('');
	};
	var set = function(dataArray, pos){
		if(typeof(pos) !== 'undefined') {
			pagePos = pos;
			updateNavi();
		}
		updateTable(dataArray);
		return this;
	};
	var currentPage = function(pos, total){
		pagePos = pos;
		if(typeof(total) !== 'undefined')
			pageTotal = total;
		updateNavi();
		trigger('data', pos);
		return this;
	};

	// event binding funcs
	var click = function(func){
		bind('click', func);
		return this;
	};
	var change = function(func){
		bind('change', func);
		return this;
	};
	var add = function(func){
		bind('add', func);
		return this;
	};
	var data = function(func){
		bind('data', func);
		return this;
	};
	var that = {
		setRow: setRow,
		set: set,
		currentPage: currentPage,
		click: click,
		change: change,
		data: data
	};
	return that;
};