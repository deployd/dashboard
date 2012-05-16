define(function(require, exports, module) {

var collectionDataViewModel = require('../view-model/collection-data-view-model');
var app = require('../app');
var undoBtn = require('./undo-button-view');

var CollectionDataView = module.exports = Backbone.View.extend({
    el: "#data"

  , template: _.template($("#collection-data-template").html())

  , initialize: function() {
    var self = this;
    self.properties = self.options.properties;
    self.collection = self.options.collection;

    self.initializeViewModel();

    self.initializeMapping();

    self.isUser = app.get('resourceTypeId') === 'UserCollection';

    self.mapProperties();
    self.properties.on('reset', self.mapProperties, self);
    self.properties.on('add', self.mapProperties, self);
    self.properties.on('remove', self.mapProperties, self);
    self.properties.on('change:name', self.mapProperties, self);

    self.mapCollection();
    self.collection.on('reset', self.mapCollection, self);
    self.collection.on('add', self.mapCollection, self);
    self.collection.on('remove', self.mapCollection, self);

    (function poll(model, xhr) {

      if (self._cleared) return;

      if (xhr && xhr.responseText) {
        self.viewModel.queryError(xhr.responseText);
      } else {
        self.viewModel.queryError("");
      }

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
      var collection = view.collection;
      var row = collection.get(data._id());
      var index = collection.indexOf(row);
      if (row) row.destroy({wait: true});
      row.set('_id', undefined);

      undoBtn.show('Delete row', function() {
        collection.create(row, {at: index});
      });
    }

    vm.saveRow = function(data) {
      var rowData = ko.mapping.toJS(data);
      var collection = view.collection;

      function error(model, xhr) {
        try {
          var res = JSON.parse(xhr.responseText);
          data.c_errors(res.errors);
        } catch (e) {
          alert("An error occurred when saving: " + xhr.responseText);
        }
      }

      if (data.isNew) {
        collection.create(rowData, {success: function() {
          data.c_errors({});
          vm.properties().forEach(function(prop) {
            if (data[prop.name()]) {
              data[prop.name()](null);
            }
          });
        }, error: error, wait: true});
      } else {
        
        var row = collection.get(data._id());
        row.save(rowData, {success: function() {
          data.c_editing(false);
          data.c_errors({});
          ko.mapping.fromJS(row.toJSON(), {}, data);
        }, error: error
      });
      } 
    }

    vm.revertRow = function(data) {
      var collection = view.collection;
      var row = collection.get(data._id());
      row.fetch({success: function() {
        ko.mapping.fromJS(row.toJSON(), {}, data);
        data.c_editing(false);
      }});
    };

    ko.computed(function() {
      view.collection.querystring = vm.queryString();
    }, vm).extend({throttle: 100});

    //Hack - this would take a fairly complex custom binding to do the right way
    ko.computed(function() {
      var error = vm.queryError();
      var $field = view.$('#current-data-querystring');
      if (error) {
        $field.attr('data-original-title', error).tooltip('fixTitle')
          .tooltip('show');
      } else {
        $field.attr('data-original-title', '').tooltip('fixTitle')
          .tooltip('hide');
      }
    }, vm);
  }

  , initializeMapping: function() {
    var view = this;
    var vm = this.viewModel;

    view.propertiesMapping = {
      'properties': {
        key: function(data) {
          return ko.utils.unwrapObservable(data._id);
        }
      }
    }

    view.collectionMapping = {
      'collection': {
        key: function(data) {
          return ko.utils.unwrapObservable(data._id);
        }
        , create: function(options) {
          return collectionDataViewModel.createRow(options.data, ko.mapping.toJS(vm.properties), vm)
        }
        , update: function(options) {
          if (!options.target.c_editing()) {
            return options.target;
          } else {
            return options.data;  
          }
        }
      } 
    }
  }

  , mapProperties: function() {
    var props = this.properties.toJSON();
    if (app.get('resourceTypeId') === 'UserCollection') {
      props.unshift({
          name: 'email'
        , type: 'string'
        , typeLabel: 'string'
      }, {
          name: 'password'
        , type: 'password'
        , typeLabel: 'password'
      });
    }

    this.viewModel.collection().forEach(function(row) {
      row.c_remapProps(props);
    });
    this.viewModel.newRow.c_remapProps(props);

    ko.mapping.fromJS({
        properties: props
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

    var self = this;

    ko.cleanNode(this.el);

    $(this.el).html(this.template({
      resourceType: app.get('resourceTypeId')
    }))

    ko.applyBindings(this.viewModel, this.el);

  }

  , close: function() {
    this._cleared = true;
    clearTimeout(this._timeout);
    ko.removeNode(this.el);
  }

});

});