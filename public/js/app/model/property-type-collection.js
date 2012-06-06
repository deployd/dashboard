define(function(require, exports, module) {
require('../backbone-utils');

var PropertyTypeCollection = module.exports = Backbone.Collection.extend({
    url: '/property-types'

  , initialize: function() {
    this.reset([
      {
          id: 'string'
        , label: 'string'
        , tooltip: "Add a string property. If the incoming value is not a string it will be rejected."
        , tooltipTitle: "Arbitrary Text"
      }, {
          id: 'number'
        , label: 'number'
        , tooltip: "Add a number property. If the incoming value is not a number it will be rejected. Supports floating point values."
        , tooltipTitle: "JSON Number"
      }, {
          id: 'boolean'
        , label: 'boolean'
        , tooltip: "Add a boolean property. If the incoming value is not 'true' or 'false' it will be rejected."
        , tooltipTitle: "True or false"
      }, {
          id: 'date'
        , label: 'date'
        , tooltip: "Add a date string property. If the incoming value is not a valid date string it will be rejected."
        , tooltipTitle: "A specific point in time"
      }, {
          id: 'object'
        , label: 'object'
        , tooltip: "Add an object property. If the incoming value is not an object it will be rejected."
        , tooltipTitle: "JSON Object"
      }, {
          id: 'array'
        , label: 'array'
        , tooltip: "Add an array property. If the incoming value is not an array it will be rejected."
        , tooltipTitle: "JSON Array"
      }
    ]);
  }

  , fetch: function() {
    var self = this;
    setTimeout(function() {
      self.trigger('reset');
    }, 0);
  }

  , sort: function(model) {
    return model.get('label');
  }

  // parse: function(json) {
  //   Object.keys(json).forEach(function(key) {
  //     if (key === "string") {
  //       json[key].tooltip = "Add a string property. If the incoming value is not a string it will be rejected.";
  //       json[key].tooltipTitle = "Arbitrary Text";
  //     } else if (key ===  "number") {
  //       json[key].tooltip = "Add a number property. If the incoming value is not a number it will be rejected.";
  //       json[key].tooltipTitle = "JSON Number";
  //     } else if (key === "boolean") {
  //       json[key].tooltip = "Add a boolean property. If the incoming value is not 'true' or 'false' it will be rejected.";
  //       json[key].tooltipTitle = "True or false";
  //     } else if (key === "date") {
  //       json[key].tooltip = "Add a date string property. If the incoming value is not a valide date string it will be rejected.";
  //       json[key].tooltipTitle = "A specific point in time";
  //     } else if (key === "object") {
  //       json[key].tooltip = "Add an object property. If the incoming value is not an object it will be rejected.";
  //       json[key].tooltipTitle = "A JSON Object";
  //     } else if (key === "array") {
  //       json[key].tooltip = "Add an array property. If the incoming value is not an array it will be rejected.";
  //       json[key].tooltipTitle = "A JSON Array";
  //     }
  //   });
  //   return Backbone.Utils.parseDictionary(json);
  // } 
});
});
