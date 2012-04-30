define(function(require, exports, module) {

var TemplateView = module.exports = Backbone.View.extend({

    initialize: function() {

      this.template = _.template($('#' + this.template).html())

      this.render();
      if (this.model) {
        this.model.on('change', this.render, this);  
      }
      if (this.collection) {
        this.collection.on('reset', this.render, this);
        this.collection.on('add', this.render, this);
        this.collection.on('remove', this.render, this);
      }
    }

    , templateData: function() {
      return {
          model: this.model
        , collection: this.collection
      };
    }

    , render: function() {
      $(this.el).html(this.template(this.templateData()));
    }

});

});
