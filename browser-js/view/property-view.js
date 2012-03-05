var PropertyView = module.exports = Backbone.View.extend({
  tagName: 'li',
  className: 'component-item',

  template: _.template($('#property-template').html()),

  render: function() {
    $(this.el).html(this.template({
      propertyModel: this.model,
      property: this.model.toJSON()
    }));
  }
  
});