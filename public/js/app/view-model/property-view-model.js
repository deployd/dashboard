define(function(require, exports) {

  var propertyMapping = {
    include: ['optional', '_id', '$renameFrom']
  };


  function create(data, contextToAdd) {

    data = _.defaults(data || {}, {
        name: " "
      , type: "string"
      , typeLabel: "string"
      , optional: false
      , required: true
    });

    data._id = data.name;
    

    var self = ko.mapping.fromJS(data, propertyMapping);
    
    self.editing = ko.observable(false);
    self.nameFocus = ko.observable();

    self.isNew = contextToAdd != null;

    self.toggleEditing = function() {
      self.editing(!self.editing());
      if (self.editing()) self.nameFocus(true);
    };

    self.onClickHeader = function(data, e) {
      if (e.target === e.currentTarget || $(e.target).is('div')) {
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

    self.setType = function(data) {
      self.type(ko.utils.unwrapObservable(data._id));      
      self.typeLabel(ko.utils.unwrapObservable(data.label));

      if (self.type() === 'boolean') {
        self.optional(false);
      }
    };


    return self;
  }

  exports.create = create;
});