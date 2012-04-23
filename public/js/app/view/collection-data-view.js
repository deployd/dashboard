define(function(require, exports, module) {

var collectionDataViewModel = require('../view-model/collection-data-view-model');
var app = require('../app');

var CollectionDataView = module.exports = Backbone.View.extend({
    el: "#data"

  , template: _.template($("#collection-data-template").html())

  , initialize: function() {
    var self = this;
    self.properties = self.options.properties;
    self.collection = self.options.collection;

    self.initializeViewModel();

    self.mapProperties();
    self.properties.on('reset', self.mapProperties, self);
    self.properties.on('add', self.mapProperties, self);
    self.properties.on('remove', self.mapProperties, self);
    self.properties.on('change:name', self.mapProperties, self);

    self.mapCollection();
    self.collection.on('reset', self.mapCollection, self);
    self.collection.on('add', self.mapCollection, self);
    self.collection.on('remove', self.mapCollection, self);

    (function poll() {
      self._timeout = setTimeout(function() {
        self.collection.fetch({success: poll, error: poll});
      }, 1000);
    })();

    self.render();
  }

  , initializeViewModel: function() {
    var view = this;
    var vm = view.viewModel = collectionDataViewModel.create();

    vm.deleteRow = function(data) {
      var row = view.collection.get(data._id());
      if (row) row.destroy();
    }
  }

  , propertiesMapping: {
    'properties': {
      key: function(data) {
        return ko.utils.unwrapObservable(data._id);
      }
    }
  }

  , collectionMapping: {
    'collection': {
      key: function(data) {
        return ko.utils.unwrapObservable(data._id);
      }
    }
  }

  , mapProperties: function() {
    ko.mapping.fromJS({
        properties: this.properties.toJSON()
      }
      , this.propertiesMapping, this.viewModel
    );
  }

  , mapCollection: function() {
    ko.mapping.fromJS({
        collection: this.collection.toJSON()
      }
      , this.collectionMapping, this.viewModel
    );
  }

  , render: function() {

    ko.cleanNode(this.el);

    $(this.el).html(this.template({
      resourceType: app.get('resourceTypeId')
    }));

    ko.applyBindings(this.viewModel, this.el);

  }

  , close: function() {
    clearTimeout(this._timeout);
    ko.removeNode(this.el);
  }

});

});