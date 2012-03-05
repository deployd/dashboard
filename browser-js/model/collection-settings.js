var CollectionSettings = module.exports = Backbone.Model.extend({
  url: function() {
    return '/resources' + this.resourcePath + '/settings';
  },

  defaults: {
    properties: new Backbone.Collection()
  },

  initialize: function() {

  },

  parse: function(json) {
    var properties = json.properties;
    delete json.properties;

    if (properties) {
      this.get('properties').reset(Backbone.Utils.parseDictionary(properties, {keyProperty: 'name'}));
    }
  }
});