define(function(require, exports, module) {

var PropertyReferenceView = module.exports = Backbone.View.extend({

      el: '#property-reference'

    , template: _.template($('#property-reference-template').html())

    , initialize: function() {

      this.render();
      this.model.on('change', this.render, this);
    }

    , render: function() {
      $(this.el).html(this.template({
        model: this.model
      }));

      this.$('li i').tooltip({
        placement: 'left'
      });
    }

});

});
