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
        json[key].tooltip = "Provides a simple API to store and edit JSON documents";
      } else if (key ===  "UserCollection") {
        json[key].tooltip = "Extends the Collection API to include email/password log in.";
      } else if (key === "Static") {
        json[key].tooltip = "Serves static files such as HTML, CSS, JavaScript, and images."
      }
    });
    return Backbone.Utils.parseDictionary(json);
  } 
});
});
