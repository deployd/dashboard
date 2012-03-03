var Resource = require('../model/resource');

var ResourceCollection = module.exports = Backbone.Collection.extend({
  model: Resource,
  url: '/resources',

  comparator: function(resource) {
    return resource.get('order');
  }
});