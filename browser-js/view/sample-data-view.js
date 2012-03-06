var SampleDataView = module.exports = Backbone.View.extend({

  el: '#sample-data',

  template: _.template($('#model-table-template').html()),

  initialize: function() {
    this.properties = this.options.properties;

    this.properties.on('reset', this.render, this);
    this.properties.on('add', this.render, this);
    this.properties.on('remove', this.render, this);
    this.properties.on('change:name', this.render, this);
  },

  render: function() {
    $(this.el).html(this.template({
      properties: this.properties.toJSON()
    }));
  }

});