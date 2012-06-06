define(["require", "exports", "module"], function(require, exports, module) {
var Property = module.exports = Backbone.Model.extend({

  defaults: {
    required: false
  },

  parse: function(json) {
    json.$renameFrom = json.name;

    return json;
  },

  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.$renameFrom = json.$renameFrom || json.id;
    if (json.$renameFrom == json.name) {
      delete json.$renameFrom;
    }
    return json;
  }

});
});
