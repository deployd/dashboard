define(["require", "exports", "module", "./property-collection"], function(require, exports, module) {
var PropertyCollection = require('./property-collection');

var CollectionSettings = module.exports = Backbone.Model.extend({
  url: function() {
    return '/resources/' + this.id
  },

  defaults: {
    properties: null,
    onGet: '',
    onPost: '/* Validation */\n' +
      '// if (this.name.length < 10) {\n' +
      '//   error("name", "Must be at least 10 characters");\n' +
      '// }\n' +
      '\n' +
      '/* Authentication */\n' +
      '// if (!me || !me.isAdmin) {\n' +
      '//   cancel("You must be an admin!", 401);\n'+
      '// }\n'+
      '\n' +
      '/* Automatic properties */\n' +
      '// this.creator = me._id;\n' +
      '// this.creatorName = me.name;\n',
    onPut: '/* Readonly properties */\n' +
    '// protect("creator");\n',
    onDelete: ''
  },

  initialize: function() {
    this.set({properties: new PropertyCollection()});

    this.get('properties').on('add', this.triggerChanged, this);
    this.get('properties').on('remove', this.triggerChanged, this);
    this.get('properties').on('update', this.triggerChanged, this);
    this.get('properties').on('change:name', this.triggerChanged, this);
    this.get('properties').on('change:required', this.triggerChanged, this);
    this.get('properties').on('change:order', this.triggerChanged, this);
  },

  parse: function(json) {
    var properties = json.properties;
    delete json.properties;

    //Copy over c_ values
    this.get('properties').each(function(prop) {
      var newProp = properties[prop.get('name')];
      if (newProp) {
        _.each(prop.attributes, function(value, key) {
          if (_.str.startsWith(key, 'c_')) {
            newProp[key] = value;
          }
        });
      } 
    });

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
});
