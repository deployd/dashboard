var PropertyTypeCollection = module.exports = Backbone.Collection.extend({
  url: '/property-types',

  sort: function(model) {
    return model.get('label');
  },

  parse: Backbone.Utils.parseDictionary
});