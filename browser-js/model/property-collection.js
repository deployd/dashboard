var Property = require('./property');

var PropertyCollection = module.exports = Backbone.Collection.extend({
  model: Property,

  comparator: function(prop) {
    return prop.get('order');
  }
});