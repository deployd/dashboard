var PropertyTypeCollection = module.exports = Backbone.Collection.extend({
  url: '/property-types',

  sort: function(model) {
    return model.get('label');
  },

  fetch: function() {
    this.reset(this.parse({
      String: {
        defaultName: 'string'
      },
      Number: {
        defaultName: 'number'
      },
      Boolean: {
        defaultName: 'boolean'
      },
      Date: {
        defaultName: 'date'
      }
    }));
  },

  parse: Backbone.Utils.parseDictionary
});