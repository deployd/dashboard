var PropertyView = require('./property-view');
var EventEmitter = require('events').EventEmitter;

var undo = require('./undo-button-view');
var events = module.exports = new EventEmitter();

$(document).ready(function() {

  var $container = $('#schema-editor');
  var $components = $('#value-type-components');
  var $insertPlaceholder = $('#insert-placeholder');
  var $insertPlaceholderInput = $('input', $insertPlaceholder);

  init();

  function init() {
    $container.sortable({
      revert: false,
      placeholder: 'placeholder',
      cancel: '.locked, .placeholder',
      receive: function(event, ui) {
        var $newItem = $($(this).data().sortable.currentItem);
        var type = $newItem.text();
        addItem($container.children(':not(.placeholder, .alert)').index($newItem), {
          type: type,
          name: type.toLowerCase()
        }).setActive(true); 

        $newItem.remove();
      }, update: function() {
        events.emit('reorder');
      }, start: function() {
        $insertPlaceholder.hide();
      }, stop: function() {
        $insertPlaceholder.appendTo($container).show();
      }, out: function() {
        $insertPlaceholder.show();
      }
    });
    $components.children().each(function() {
      $(this).draggable({
        connectToSortable: $container,
        helper: "clone",
        revert: "invalid",
        revertDuration: 100, 
        appendTo: 'body'
      }).dblclick(function() {
        console.log('Double click');
        var type = $(this).text();
        addItem($container.children('.property').length, {
          type: type,
          name: type.toLowerCase()
        }).setActive(true);
      });
    });

    $container.on('click', '.delete-btn', onDeleteItem);

    $insertPlaceholderInput.keypress(function(e) {
      if (e.keyCode == 13) {
        addItem($container.children('.property').length, {name: $(this).val()});
        $(this).val('');
      }
    });
    
    $(document).keypress(function(e) {
      if (e.keyCode == 27) {
        $insertPlaceholderInput.blur();
      }
    });
  }

  function addItem(position, data) {
    var view = PropertyView(data);
    view.$el.data('propertyView', view)
    $container.children('.property').eq(position - 1).after(view.$el);

    events.emit('addProperty', position, view.model); 
    view.events.on('changeName', function(model) {
      events.emit('changeName', position, model);
    });

    return view;
  }

  function onDeleteItem(e) {

    var position = $container.children('.property').index($item);
    var $item = $(this).parents('.property');
    // var $alert = $("<div class='alert'><a class='close' data-dismiss='alert' href='#'>&times;</a><strong>Item deleted</strong><a href='#' class='undo-btn'>Undo</a></div>");
    var oldModel = {
      name: $('.header .name', $item).text(),
      type: $('.header .type', $item).text()
    };
    undo.show('Delete ' + oldModel.name, function() {
      addItem(position, oldModel);
      return false;
    });
    $item.remove();
    events.emit('deleteProperty', position);
    return false;
  }  
  
  
});