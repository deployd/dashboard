var app = require('./app');

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    ':id': 'resource'
  },

  home: function() {
    app.set({
      resourceId: '',
      resourceName: undefined,
      resourceType: undefined
    });
  },

  resource: function(id) {
    app.set({
      resourceId: id
    });
  }
});

module.exports = new Router();