var template = _.template($('#resource-template').html());

var ResourceView = module.exports = Backbone.View.extend({
  tagName: 'li',
  className: 'component-item',
  
  events: {
    'click .delete-btn': 'onDelete'
  },
  
  initialize: function(){
    this.parentView = this.options.parentView;
  },
  
  render: function(){
    $(this.el).attr('data-cid', this.model.cid).html(template({
      resource: this.model.toJSON()
    }));
    return this;
  },

  onDelete: function() {
    var self = this;
    var del = function() {
      self.parentView.collection.remove(self.model);
    };

    if (self.model.get('c_saved')) {
      confirm('Do you wish to delete this resource? All associated data and configuration will be permanently removed.') && del();
    } else {
      del();
    }
  },

  destroy: function() {

  }
});
