define(function(require, exports, module) {

  var FolderViewModel = require('view-model/folder-view-model');

  var StaticView = module.exports = Backbone.View.extend({

    template: _.template($('#static-template').html())

    , initialize: function() {
      this.initializeViewModel();
      this.render();
    }

    , initializeViewModel: function() {
      this.viewModel = FolderViewModel.create();
      this.viewModel.fetchFiles();
    }

    , render: function() {
      this.$el.html(this.template({}));

      ko.cleanNode(this.el);

      ko.applyBindings(this.viewModel, this.el);
    }

    , close: function() {
      ko.removeNode(this.el);
    }

  });
});