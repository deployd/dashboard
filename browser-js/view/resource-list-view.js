var Resource = require('../model/resource');
var ResourceView = require('./resource-view');

var ResourceListView = module.exports = Backbone.View.extend({
  el: '#resource-list',
  emptyEl: '#resource-list-empty',

  subViews: [],

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
      cancel: '.placeholder, .well',
      distance: 10,

      receive: _.bind(function() {
        var $newItem = $($(this.el).data().sortable.currentItem);
        var index = $(this.el).children(':not(.placeholder)').index($newItem);
        this.onReceiveComponent($newItem, index);
      }, this),
      update: _.bind(this.onReorder, this)
    });

    $('.placeholder', this.emptyEl).droppable({
      hoverClass: 'highlight',

      drop: _.bind(function(event, ui) {
        var $newItem = $(ui.helper);
        this.onReceiveComponent($newItem);
      }, this)
    });
  },

  addItem: function(type, index) {
    if (isNaN(index)) {
      index = this.collection.length;
    }
    
    var resource = new Resource({
      path: type.get('defaultPath'),
      typeLabel: type.get('label'),
      type: type.get('_id'),
      order: index + 1,
      c_active: true
    });
    
    this.collection.add(resource, {at: index});
    this.updateOrder();

    process.nextTick(function() {
      this.$('#' + resource.cid).find('input[name="path"]').focus();
    });
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
      if (!item.isNew()) {
        item.save({order: order}, {silent: true});
      } else {
        item.set({order: order}, {silent: true});
      }
    });
  },

  onReceiveComponent: function($newItem, index) {
    var typeCid = $newItem.attr('data-cid');
    var type = this.parentView.resourceTypes.getByCid(typeCid);

    $newItem.remove();

    this.addItem(type, index);
  },

  onReorder: function() {
    this.updateOrder();    
  },

  render: function(e) {
    var self = this;
    _.each(self.subViews, function(subView) {
      subView.destroy();
    });
    $(self.el).empty();
    if (self.collection.length) {
      $(self.el).show();
      $(self.emptyEl).hide();
      self.subViews = self.collection.map(function(resource) {
        var view = new ResourceView({model: resource, parentView: self});
        $(self.el).append(view.el);
        view.render();
        return view;
      });
    } else {
      $(self.el).hide();
      $(self.emptyEl).show();
    }
  }
});