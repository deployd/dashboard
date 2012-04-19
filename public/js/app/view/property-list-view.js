define(function(require, exports, module) {

var koUtil = require('../knockout-utils');

var app = require('../app');
var undoBtn = require('./undo-button-view');

var propertyListViewModel = require('../view-model/property-list-view-model');
var propertyViewModel = require('../view-model/property-view-model');

var PropertyListView = module.exports = Backbone.View.extend({
    el: '#property-list'

  , template: _.template($('#property-list-template').html())

  , initialize: function() {

    this.collection = this.collection || this.options.collection;
    this.typeCollection = this.typeCollection || this.options.typeCollection;

    this.initializeViewModel();
    
    this.mapProperties();
    this.collection.on('reset', this.mapProperties, this);
    this.mapTypes();
    this.typeCollection.on('reset', this.mapTypes, this);

    this.render();
  }

  , initializeViewModel: function() {

    var view = this;
    this.viewModel = propertyListViewModel.create();

    this.mapping = {
      'properties': {
          key: function(data) { return ko.utils.unwrapObservable(data.name); }
        , create: _.bind(function(options) { return propertyViewModel.create(options.data) }, this)
      }
    };

    ko.computed(function() {
      var lastJSON = view._lastJSON;
      var unmapped = ko.mapping.toJS(this);
      var newJSON = unmapped.properties;

      if (lastJSON && !koUtil.objectEquals(lastJSON, newJSON)) {
        view.collection.reset(unmapped.properties, {silent: true});
        view.collection.trigger('update');
        view._lastJSON = newJSON;
      }
    }, this.viewModel).extend({throttle: 100});

  }

  , mapProperties: function() {

    var json = this.collection.toJSON()

    this._lastJSON = json;

    ko.mapping.fromJS({
      properties: json
    }, this.mapping, this.viewModel);

    //Emergency remapping
    var newJson = ko.mapping.toJS(this.viewModel);
    if (!koUtil.objectEquals(newJson.properties, json)) {
      console.log("WARNING: viewmodel/model mismatched. Remapping...")
      this.viewModel.properties.removeAll();
      setTimeout(_.bind(this.mapProperties, this), 1);
    }
  }

  , mapTypes: function() {
    ko.mapping.fromJS({
      propertyTypes: this.typeCollection.toJSON()
    }, this.mapping, this.viewModel);
  }

  , render: function() {
    if (this.el) ko.cleanNode(this.el);

    $(this.el).html(this.template({
      resourceTypeId: app.get('resourceTypeId')
    }));

    ko.applyBindings(this.viewModel, this.el);
  }

  , close: function() {
    ko.removeNode(this.el);
  }
  
});

});
