var app = require('./app');

var Router = Backbone.Router.extend({
  routes: {
    'dashboard': 'home',
    'dashboard/*resource': 'resource'
  },

  home: function() {
    app.set({
      resourceName: undefined,
      resourceType: undefined
    });
  },

  resource: function(resource) {
    app.set({
      resourceName: '/' + resource,
      resourceType: 'Collection'
    });
  }
});

module.exports = new Router();