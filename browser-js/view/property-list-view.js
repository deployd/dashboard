var PropertyView = require('./property-view');

var PropertyListView = module.exports = Backbone.View.extend({
  el: '#property-list',

  initialize: function() {
    this.parentView = this.options.parentView;
    this.collection = this.options.collection;
    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.render, this);
    this.collection.on('remove', this.render, this);

    this.initializeDom();  
  },

  initializeDom: function() {
    
  },

  render: function() {
    var self = this;
    _.each(self.subViews, function(subView) {
      subView.destroy();
    });
    $(self.el).children(':not(.locked)').remove();
      self.subViews = self.collection.map(function(property) {
      var view = new PropertyView({model: property, parentView: self});
      $(self.el).append(view.el);
      view.render();
      return view;
    });
  }
});