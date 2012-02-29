var schemaEditor = require('./schema-edit-view');
var sampleDataTableTemplate = Handlebars.compile($('#sample-data-table-template').html());

$(document).ready(function() {
	$table = $('#sample-data');
	$head = $('thead tr', $table);
	$rows = $('tbody tr', $table);

	schemaEditor.on('addProperty', function(position, property) {
		render();
	});

	schemaEditor.on('deleteProperty', function(position) {
		render();
	});

	schemaEditor.on('changeName', function(position) {
		render();
	});

	schemaEditor.on('reorder', function(position) {
		render();
	});

	function render() {
		var $properties = $('#schema-editor .property');
		var props = [];
		var sampleRows = [];

		console.log('animating');
		$('#data-viewer').stop().animate({backgroundColor: '#ffc'}, 0).animate({backgroundColor: '#fff'}, 1000);

		$properties.each(function() {
			var prop = {
				name: $('.name', this).text(),
				type: $('.type', this).text()
			};
			if (prop.type !== '_id') {
				props.push(prop);
			}
		});

		for (var i = 0; i < 3; i++) {
			sampleRows.push(_.map(props, function(prop) {
				return prop.type;
			}));
		}

		var $newTable = $(sampleDataTableTemplate({
			properties: props,
			sampleRows: sampleRows,
			footerSpan: props.length + 2
		}));
		$table.replaceWith($newTable);
		$table = $newTable;
	}
});