var ResourceTypeCollection = module.exports = Backbone.Collection.extend({
  url: '/types',

  sort: function(model) {
    console.log(model);
    return model.get('label');
  },

  parse: Backbone.Utils.parseDictionary
});