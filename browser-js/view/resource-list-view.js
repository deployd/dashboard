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

      receive: _.bind(this.onReceiveComponent, this)
    });
  },

  onReceiveComponent: function() {
    var $newItem = $($(this.el).data().sortable.currentItem);
    var typeCid = $newItem.attr('data-cid');
    var type = this.parentView.resourceTypes.getByCid(typeCid);
    var index = $(this.el).children(':not(.placeholder)').index($newItem);

    $newItem.remove();

    this.collection.add(new Resource({
      path: '/' + type.get('id'),
      typeId: type.get('id'),
      typeName: type.get('name'),
      order: index,
      c_saved: false
    }), {at: index});
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