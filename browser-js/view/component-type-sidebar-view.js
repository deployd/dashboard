var ComponentTypeSidebarView = module.exports = Backbone.View.extend({

  events: {
    'click li': 'onAddItem'
  },

  initialize: function() {
    this.collection = this.collection || this.options.collection;
    this.template = this.template || this.options.template;
    this.listView = this.listView || this.options.listView

    this.collection.on('reset', this.render, this);
  },

  render: function() {
    var self = this;
    $(this.el).html(this.template({
      types: this.collection
    }));

    self.$('li').each(function() {
      $(this).draggable({
        connectToSortable: $(self.listView.el),
        helper: 'clone',
        revert: 'invalid',
        revertDuration: 100,
        appendTo: 'body'
      });
    })
  },

  onAddItem: function(e) {
    var typeCid = $(e.currentTarget).attr('data-cid');
    var type = this.collection.getByCid(typeCid);
    this.listView.addItem(type); 
  },

});