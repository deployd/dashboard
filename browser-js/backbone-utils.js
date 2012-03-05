Backbone.Model.prototype.idAttribute = "_id";
var oldSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
  var url = _.isFunction(model['url']) ? model['url']() : model['url'];
  url = '/db' + url

  var data = options.data || model.toJSON();
  _.each(data, function(val, key) {
    if (_.str.startsWith(key, 'c_')) {
      delete data[key];
    }
  });
  options.contentType = 'application/json';
  options.data = JSON.stringify(data);

  options.url = options.url || url;
  return oldSync(method, model, options);
};

Backbone.Utils = Backbone.Utils || {};
Backbone.Utils.parseDictionary = function(resp, options) {
  var defaults = {
    keyProperty: 'label'
  }
  _.defaults(options, defaults);

  var keys = Object.keys(resp);
  var result = [];

  _.each(keys, function(key) {
    var model = resp[key];
    model._id = key;
    model[options.keyProperty] = model[options.keyProperty] || key;
    result.push(model);
  });

  return result;
};
