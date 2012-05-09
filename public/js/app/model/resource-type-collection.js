define(function(require, exports, module) {
require('../backbone-utils');


var ResourceTypeCollection = module.exports = Backbone.Collection.extend({
  url: '/types',

  sort: function(model) {
    return model.get('label');
  },

  parse: function(json) {
    Object.keys(json).forEach(function(key) {
      if (key === "Collection") {
        json[key].tooltip = "Add a simple store to save, update, fetch and delete JSON objects. Available over REST at the specified url.";
        json[key].tooltipTitle = "Persist Data";
      } else if (key ===  "UserCollection") {
        json[key].tooltip = "Add a collection of users such as 'admins', 'authors', or just 'users'. Store users as JSON objects and log them in over REST.";
        json[key].tooltipTitle = "Manage Users";
      } else if (key === "Static") {
        delete json[key];
      }
    });
    return Backbone.Utils.parseDictionary(json);
  } 
});
});
