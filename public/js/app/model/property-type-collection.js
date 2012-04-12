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
        json[key].tooltip = "Arbitrary text";
      } else if (key ===  "number") {
        json[key].tooltip = "Numeric value, supports floating points";
      } else if (key === "boolean") {
        json[key].tooltip = "True or false";
      } else if (key === "date") {
        json[key].tooltip = "A specific point in time";
      }
    });
    return Backbone.Utils.parseDictionary(json);
  } 
});
});
