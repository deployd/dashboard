// require('./view/divider-drag.js');
// require('./view/schema-edit-view.js');
// require('./view/sample-data-view.js');

// new require('./view/resources-view')();

Backbone.Model.prototype.idAttribute = "_id";
var oldSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
  var url = _.isFunction(model['url']) ? model['url']() : model['url'];
  url = '/db' + url

  options.url = options.url || url;
  return oldSync(method, model, options);
};


require('./view/undo-button-view');
var ResourcesView = require('./view/resources-view');
new ResourcesView();