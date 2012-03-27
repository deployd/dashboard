var App = Backbone.Model.extend({
  defaults: {
    appName: 'My App',
    appUrl: ''
  }
});

module.exports = new App();