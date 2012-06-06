define(function(require, exports) {

  var propertyMapping = {
    include: ['required', 'id', '$renameFrom']
  };


  function create(data, contextToAdd) {

    data = _.defaults(data || {}, {
        name: " "
      , type: "string"
      , typeLabel: "string"
      , required: false
    });

    data.id = data.name;
    

    var self = ko.mapping.fromJS(data, propertyMapping);

    self.name = self.name.extend({variableName: true});
    
    self.editing = ko.observable(false);
    self.nameFocus = ko.observable();

    self.isNew = contextToAdd != null;

    self.toggleEditing = function() {
      self.editing(!self.editing());
      if (self.editing()) self.nameFocus(true);

      return false;
    };

    self.onClickHeader = function(data, e) {
      if (!self.editing() || (e.target === e.currentTarget || $(e.target).is('div'))) {
        self.toggleEditing();  
        return false;
      }

      return true;
    };

    self.onNameKeypress = function(data, e) {
      if (e.which == 13) {
        setTimeout(function() {
          if (self.isNew) {
            contextToAdd.addProperty();
          } else {
            self.editing(false);
          }
        }, 1);
      }

      return true;
    };
    
    self.onNameKeyDown = function (data, e) {
      if(commands[e.which]) {
        return execCommand(data, e);
      }
      
      return true;
    };

    self.setType = function(data) {
      self.type(ko.utils.unwrapObservable(data.id));      
      self.typeLabel(ko.utils.unwrapObservable(data.label));
    };

    // var types = {'string': 0, 'number': 1, 'boolean': 2, 'date': 3};
    var types = ['string', 'number', 'boolean', 'date', 'object', 'array'];

    var commands = {
      // cmd + b (boolean)
      66: function (data) {
        data.type('boolean');
      },
      // cmd + s (string)
      83: function (data) {
        data.type('string');
      },
      // cmd + m (number)
      77: function (data) {
        data.type('number');
      },
      // cmd + d (date)
      68: function (data) {
        data.type('date');
      },
      // up arrow
      38: function (data) {
        var cur = data.type();
        for(var i = 0; i < types.length; i++) {
          if(cur === types[i]) {
            data.type(types[i + 1] || types[0]);
            return;
          }
        }
      },
      // down arrow
      40: function (data) {
        var cur = data.type();
        for(var i = 0; i < types.length; i++) {
          if(cur === types[i]) {
            data.type(types[i - 1] || types[types.length - 1]);
            return;
          }
        }
      },
      // cmd + o
      79: function (data) {
        data.required(!data.required());
      }
    };
    
    function execCommand(data, e) {
      console.log(e.which);
      if(e.metaKey || e.which === 38 || e.which === 40) {
       commands[e.which] && commands[e.which](data);
       return false;
      }
      return true;
    }

    return self;
  }

  exports.create = create;
});