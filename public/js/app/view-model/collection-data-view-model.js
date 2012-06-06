define(function(require, exports, module) {

  createRow = exports.createRow = function(data, props, vm) {

    var self = {};

    function map(data, props) {
      var defaults = {id: null};
      props.forEach(function(prop) {
        defaults[prop.name] = undefined;
      });

      data = _.defaults(data, defaults);

      ko.mapping.fromJS(data, {}, self);
    }

    map(data, props);

    self.c_editing = ko.observable(false);
    self.c_focus = ko.observable();
    self.c_errors = ko.observable({});

    self.c_formatted = function(name, type) {
      var name = ko.utils.unwrapObservable(name);
      var type = ko.utils.unwrapObservable(type);
      var value = ko.utils.unwrapObservable(self[name]);
      if (type === 'password' || typeof value === 'undefined') {
        return '...';
      } else {
        return value;
      }
    }

    self.c_toggleEditing = function() {
      if (self.c_editing() && !self.isNew) {
        vm.revertRow(self);
      } else {
        self.c_editing(true);  
      }
    };

    self.c_remapProps = function(props) {
      var data = ko.mapping.toJS(self);
      map(data, props);
    };

    self._onKeypress = function(data, e) {
      if (e.which == 13) {
        setTimeout(function() {
          vm.saveRow(self);
        }, 1);
      } else if (e.which == 27 && !self.isNew) {
        setTimeout(function() {
          vm.revertRow(self);
        }, 1);
      }

      return true;
    };

    self._onDoubleclick = function(data, e) {
      if (!self.c_editing()) {
        self.c_editing(true);
        self.c_focus(data.name());
      } else {
        return true;
      }
    };

    return self;
  };

  create = exports.create = function() {
    var self = {
        properties: ko.observableArray()
      , collection: ko.observableArray()
      , queryString: ko.observable()
      , queryError: ko.observable("")
    };

    self.newRow = createRow({}, [], self);
    self.newRow.isNew = true;

    return self;
  };

});