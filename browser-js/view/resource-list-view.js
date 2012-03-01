var Resource = require('../model/resource');
var ResourceView = require('./resource-view');

// var template = _.template($('#resource-list-template').html());

var ResourceListView = module.exports = Backbone.View.extend({
  el: '#resource-list',

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
      cancel: '.placeholder',
      distance: 10,

      receive: _.bind(this.onReceiveComponent, this),
      update: _.bind(this.onReorder, this)
    });
  },

  addItem: function(type, index) {
    if (isNaN(index)) {
      index = this.collection.length;
    }
    
    var resource = new Resource({
      path: type.get('defaultPath'),
      typeId: type.id,
      typeName: type.get('name'),
      order: index,

      c_active: true
    });
    this.collection.add(resource, {at: index});

    process.nextTick(function() {
      this.$('#' + resource.cid).find('input[name="path"]').focus();
    });
  },

  onReceiveComponent: function() {
    var $newItem = $($(this.el).data().sortable.currentItem);
    var typeCid = $newItem.attr('data-cid');
    var type = this.parentView.resourceTypes.getByCid(typeCid);
    var index = $(this.el).children(':not(.placeholder)').index($newItem);

    $newItem.remove();

    this.addItem(type, index);
  },

  onReorder: function() {
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
        item.save({order: order});
      } else {
        item.set({order: order});
      }
    });

    this.collection.sort();

    return false;
    
  },

  render: function() {
    var self = this;
    _.each(self.subViews, function(subView) {
      subView.destroy();
    });
    $(self.el).empty();
    self.subViews = self.collection.map(function(resource) {
      var view = new ResourceView({model: resource, parentView: self});
      $(self.el).append(view.el);
      view.render();
      return view;
    });
  }
});