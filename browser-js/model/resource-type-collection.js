var ResourceTypeCollection = module.exports = Backbone.Collection.extend({
  url: '/resourcetypes',

  sort: function(model) {
    return model.get('label');
  },

  parse: Backbone.Utils.parseDictionary
});