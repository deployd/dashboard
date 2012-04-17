define(function(require, exports, module) {

var koUtil = require('../knockout-utils');

var app = require('../app');
var undoBtn = require('./undo-button-view');

var PropertyListView = module.exports = Backbone.View.extend({
    el: '#property-list'

  , template: _.template($('#property-list-template').html())

  , mapping: {

  }

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

    var vm = this.viewModel =  {
        properties: ko.observableArray()
      , propertyTypes: ko.observableArray()

      , newName: ko.observable()
      , newType: ko.observable()
    };

    vm.addProperty = _.bind(function() {
      if (this.newName() && this.newType()) {
        this.properties.push({
            name: ko.observable(this.newName())
          , type: ko.observable(this.newType().type())
          , typeLabel: ko.observable(this.newType().label())
        });

        this.newName('');
      }
      
    }, vm);

    vm.removeProperty = _.bind(function(prop) {
      var self = this;
      var index = this.properties.indexOf(prop);

      undoBtn.show('Delete ' + prop.name(), function() {
        self.properties.splice(index, 0, prop);
      });

      this.properties.remove(prop);
    }, vm);
   
    return vm;

  }

  , mapProperties: function() {

    ko.mapping.fromJS({
      properties: this.collection.toJSON()
    }, this.mapping, this.viewModel);

  }

  , mapTypes: function() {
    ko.mapping.fromJS({
      propertyTypes: this.typeCollection.toJSON()
    }, this.mapping, this.viewModel);
  }

  , render: function() {
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
