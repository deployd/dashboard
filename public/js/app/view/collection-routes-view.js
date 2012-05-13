define(function(require, exports, module) {

var CollectionRoutesView = module.exports = Backbone.View.extend({

      el: '#api'

    , template: _.template($('#collection-routes-template').html(), null, {variable: 'resourceData'})

    , initialize: function() {
      this.render();
      this.model.on('change', this.render, this);
    }

    , render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      prettyPrint();
    }

});

});