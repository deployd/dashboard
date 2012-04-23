define(function(require, exports, module) {

  exports.create = function() {
    var self = {
        properties: ko.observableArray()
      , collection: ko.observableArray()
    };

    return self;
  };

});