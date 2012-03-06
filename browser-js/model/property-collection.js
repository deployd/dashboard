var PropertyCollection = module.exports = Backbone.Collection.extend({
  comparator: function(prop) {
    return prop.get('order');
  }
});