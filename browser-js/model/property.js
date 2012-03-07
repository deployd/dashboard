var Property = module.exports = Backbone.Model.extend({

  parse: function(json) {
    json.$renameFrom = json.name;

    return json;
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    if (json.$renameFrom == json.name) {
      delete json.$renameFrom;
    }
    return json;
  }

});