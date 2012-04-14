define(function(require, exports, module) {
require('../backbone-utils');

var PropertyTypeCollection = module.exports = Backbone.Collection.extend({
  url: '/property-types',

  sort: function(model) {
    return model.get('label');
  },

  parse: function(json) {
    Object.keys(json).forEach(function(key) {
      if (key === "string") {
        json[key].tooltip = "Add a string property. If the incoming value is not a string it will be rejected.";
        json[key].tooltipTitle = "Arbitrary Text";
      } else if (key ===  "number") {
        json[key].tooltip = "Add a number property. If the incoming value is not a number it will be rejected.";
        json[key].tooltipTitle = "JSON Number";
      } else if (key === "boolean") {
        json[key].tooltip = "Add a boolean property. If the incoming value is not 'true' or 'false' it will be rejected.";
        json[key].tooltipTitle = "True or false";
      } else if (key === "date") {
        json[key].tooltip = "Add a date string property. If the incoming value is not a valide date string it will be rejected.";
        json[key].tooltipTitle = "specific point in time";
      }
    });
    return Backbone.Utils.parseDictionary(json);
  } 
});
});
