var ResourceTypeCollection = module.exports = Backbone.Collection.extend({
  url: '/resourcetypes',

  sort: function(model) {
    return model.get('label');
  },

  parse: function(resp) {
    var keys = Object.keys(resp);
    var result = [];

    _.each(keys, function(key) {
      var model = resp[key];
      model._id = key;
      model.label = model.label || key;
      result.push(model);
    });

    return result;
  }
});