var HeaderView = module.exports = Backbone.View.extend({
  el: '#header',

  template: _.template($('#header-template').html()),

  initialize: function() {
    this.model.on('change', this.render, this);
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));

    return this;
  }
});