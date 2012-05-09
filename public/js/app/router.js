define(["require", "exports", "module", "./app"], function(require, exports, module) {
var app = require('./app');

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'files': 'files',
    'files/*path': 'editFile',
    ':id': 'resource'
  },

  home: function() {
    app.set({
      resourceId: undefined,
      files: undefined
    });
  },

  resource: function(id) {
    app.set({
      resourceId: id,
      files: undefined
    });
  },

  files: function() {
    app.set({
      resourceId: undefined,
      files: true
    });
  },
  
  editFile: function (path) {
    app.set({
      resourceId: undefined,
      files: path
    });
  }
});

module.exports = new Router();
});
