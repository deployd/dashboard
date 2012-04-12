define(["require", "exports", "module", "../model/property","./property-view"], function(require, exports, module) {
var Property = require('../model/property');

var PropertyView = require('./property-view');


var PropertyListView = module.exports = Backbone.View.extend({
  el: '#property-list',
  emptyEl: '#property-list-empty',

  initialize: function() {
    this.parentView = this.options.parentView;
    this.collection = this.options.collection;
    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.render, this);
    this.collection.on('remove', this.render, this);

    this.initializeDom();  
  },

  initializeDom: function() {
    $(this.el).sortable({
      revert: false,
      placeholder: 'placeholder',
      cancel: '.placeholder, .locked',
      items: '> li:not(.locked)',
      distance: 10,

      receive: _.bind(function() {
        if ($(this.el).is(':visible')) {
          var $newItem = $($(this.el).data().sortable.currentItem);
          var index = $(this.el).children(':not(.placeholder, .locked)').index($newItem); 
          this.onReceiveItem($newItem, index);
        }
      }, this),
      update: _.bind(this.updateOrder, this)
    });

    $('.placeholder', this.emptyEl).droppable({
      hoverClass: 'highlight',

      drop: _.bind(function(event, ui) {
        if (this.collection.length === 0) {
          var $newItem = $(ui.helper);
          this.onReceiveItem($newItem);
        }
      }, this)
    });
  },

  addItem: function(type, index) {
    if (isNaN(index)) {
      index = this.collection.length;
    }
    
    var resource = new Property({
      name: type.get('defaultName'),
      typeId: type.id,
      typeLabel: type.get('label'),
      type: type.get('label'),
      order: index + 1,

      c_active: true
    });
    this.collection.add(resource, {at: index});

    setTimeout(function() {
      this.$('#' + resource.cid).find('input[name="name"]').focus();
    }, 0);
  },

  render: function() {
    var self = this;

    var $focus = $(self.el).find('input[name="name"]:focus');
    if ($focus) {
      var focusName = $focus.val();
    }

    _.each(self.subViews, function(subView) {
      subView.destroy();
    });
    $(self.el).children(':not(.locked)').remove();

    if (self.collection.length) {
      $(self.el).show();
      $(self.emptyEl).hide();
      self.subViews = self.collection.map(function(property) {
        var view = new PropertyView({model: property, parentView: self});
        $(self.el).append(view.el);
        view.render();
        return view;
      });    

      if ($focus) {
        self.$('input[name="name"][value="' + focusName + '"]').focus();
      }
    } else {
      $(self.el).hide();
      $(self.emptyEl).show();
    }
  },

  onReceiveItem: function($newItem, index) {
    index = 0 || index;
    var typeCid = $newItem.attr('data-cid');
    var type = this.parentView.propertyTypes.getByCid(typeCid);

    $newItem.remove();

    this.addItem(type, index);
  },

  updateOrder: function() {
    var self = this;
    var items = [];
    
    $(this.el).children().each(function() {
      var item = self.collection.getByCid($(this).attr('id'));
      if (item) {
        items.push(item);  
      }
    });

    var order = 0;
    
    _.each(items, function(item) {
      order += 1;
      item.set({order: order});
    });

    self.collection.sort();
  }
});
});
