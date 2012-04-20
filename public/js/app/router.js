define(["require", "exports", "module", "./app"], function(require, exports, module) {
var app = require('./app');

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    ':id': 'resource',
    'edit/*path': 'edit'
  },

  home: function() {
    app.set({
      resourceId: '',
      resourceName: undefined,
      resourceType: undefined,
      edit: undefined
    });
  },

  resource: function(id) {
    app.set({
      resourceId: id,
      edit: undefined
    });
  },
  
  edit: function (path) {
    app.set({
      edit: path
    });
  }
});

module.exports = new Router();
});
