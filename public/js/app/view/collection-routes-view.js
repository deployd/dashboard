define(function(require, exports, module) {

var CollectionRoutesView = module.exports = Backbone.View.extend({

      el: '#routes'

    , template: _.template($('#collection-routes-template').html())

    , initialize: function() {
      this.render();
      this.model.on('change', this.render, this);
    }

    , render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
    }

});

});