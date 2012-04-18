define(function(require, exports) {

  var propertyMapping = {
    include: ['optional', '_id', '$renameFrom']
  };


  function create(data) {

    data = _.defaults(data, {
        _id: data.name
      , optional: false
      , required: true
    })
    

    var self = ko.mapping.fromJS(data, propertyMapping);

    self.$renameFrom = self.name(); //TODO: This won't update after a save
    
    self.editing = ko.observable(false);
    self.nameFocus = ko.observable();

    self.toggleEditing = function() {
      self.editing(!self.editing());
    };

    self.onClickName = function(data, e) {
      self.editing(true);
      self.nameFocus(true);
    };

    self.onClickHeader = function(data, e) {
      if (e.target === e.currentTarget) {
        self.toggleEditing();  
        return false;
      }

      return true;
    }

    return self;
  }

  exports.create = create;
});