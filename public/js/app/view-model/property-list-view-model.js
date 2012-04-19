define(function(require, exports) {

  var undoBtn = require('../view/undo-button-view');

  var propertyViewModel = require('./property-view-model');

  function create() {

    var vm = {
        properties: ko.observableArray()
      , propertyTypes: ko.observableArray()
    };

    vm.newProperty = propertyViewModel.create({}, vm);
    vm.newProperty.nameFocus(true);

    vm.addProperty = _.bind(function() {
      if (this.newProperty.name() && this.newProperty.type()) {
        this.properties.push(propertyViewModel.create(
          ko.mapping.toJS(this.newProperty)
        ));

        this.newProperty.name('');
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

    vm.onNewNameKeypress = _.bind(function(context, e) {
      if (e.which == 13) {
        setTimeout(function() {
          vm.addProperty();
        }, 1);
      }
      return true;
    }, vm);

    return vm;
  }

  exports.create = create;

});