define(function(require, exports) {

  function create() {

    var view = this;

    var vm = this.viewModel = {
        properties: ko.observableArray()
      , propertyTypes: ko.observableArray()

      , newName: ko.observable()
      , newType: ko.observable()
    };

    vm.addProperty = _.bind(function() {
      if (this.newName() && this.newType()) {
        this.properties.push(view.createPropertyViewModel({
            name: ko.observable(this.newName())
          , type: ko.observable(this.newType()._id())
          , typeLabel: ko.observable(this.newType().label())
        }));

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