var PropertyCollection = require('./property-collection');

var CollectionSettings = module.exports = Backbone.Model.extend({
  url: function() {
    return '/resources/' + this.id
  },

  defaults: {
    properties: new PropertyCollection(),
    onGet: '',
    onPost: '',
    onPut: '',
    onDelete: ''
  },

  initialize: function() {
    this.get('properties').on('add', this.triggerChanged, this);
    this.get('properties').on('remove', this.triggerChanged, this);
    this.get('properties').on('change:name', this.triggerChanged, this);
    this.get('properties').on('change:required', this.triggerChanged, this);
    this.get('properties').on('change:order', this.triggerChanged, this);
  },

  parse: function(json) {
    var properties = json.properties;
    delete json.properties;

    if (properties) {
      this.get('properties').reset(Backbone.Utils.parseDictionary(properties, {keyProperty: 'name'}), {parse: true});;
    }

    return json;
  },

  triggerChanged: function() {
    this.trigger('change');
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.properties = Backbone.Utils.toJSONDictionary(json.properties.toJSON(), {keyProperty: 'name'});


    return json;
  }
});