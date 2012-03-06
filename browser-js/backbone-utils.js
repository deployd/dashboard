Backbone.Model.prototype.idAttribute = "_id";
var oldSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
  var url = _.isFunction(model['url']) ? model['url']() : model['url'];
  url = '/db' + url

  if (method === 'create' || method === 'update') {
    var data = options.data || model.toJSON();

    Backbone.Utils.removeClientValues(data);  
    
    options.contentType = 'application/json';
    options.data = JSON.stringify(data);
  }

  

  options.url = options.url || url;
  return oldSync(method, model, options);
};



Backbone.Utils = Backbone.Utils || {};
Backbone.Utils.removeClientValues = function(json) {
  if (isArray(json)) {
    _.each(json, function(val, index) {
      if (typeof val === 'object') {
        Backbone.Utils.removeClientValues(val);
      }
    });
  } else {
    _.each(json, function(val, key) {
      if (_.str.startsWith(key, 'c_')) {
        delete json[key];
      } else if (typeof val === 'object') { //Will also catch arrays
        Backbone.Utils.removeClientValues(val);
      }
    });
   }
   return json;
};
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

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}
