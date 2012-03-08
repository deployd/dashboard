var App = Backbone.Model.extend({
  defaults: {
    appName: 'My App',
    appUrl: 'https://myapp.deploydapp.com'
  }
});

module.exports = new App();