define(["require", "exports", "module", "../model/resource"], function(require, exports, module) {
var Resource = require('../model/resource');

var ResourceCollection = module.exports = Backbone.Collection.extend({
  model: Resource,
  url: '/resources',

  comparator: function(resource) {
    return resource.get('order');
  }
});
});
