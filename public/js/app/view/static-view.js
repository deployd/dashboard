define(function(require, exports, module) {

  var FolderViewModel = require('view-model/folder-view-model');

  var viewModelInstance;

  var StaticView = module.exports = Backbone.View.extend({

    template: _.template($('#static-template').html())

    , initialize: function() {
      this.initializeViewModel();
      this.render();
    }

    , initializeViewModel: function() {
      if (!viewModelInstance) {
        viewModelInstance = FolderViewModel.create();  

      }
      this.viewModel = viewModelInstance;
      this.viewModel.fetch();
    }

    , render: function() {
      this.$el.html(this.template({}));

      ko.cleanNode(this.el);

      ko.applyBindings(this.viewModel, this.el);

      prettyPrint();
    }

    , close: function() {
      ko.removeNode(this.el);
    }

  });
});