define(["require", "exports", "module"], function(require, exports, module) {
var App = Backbone.Model.extend({
  defaults: {
    appName: 'My App',
    appUrl: ''
  },

  initialize: function() {
    this.on('change:resourceTypeId', this.setDocLink, this);
    this.setDocLink();
  },

  setDocLink: function() {
    var type = this.get('resourceTypeId');
    var url = 'http://deployd.github.com/deployd/';
    if (type === 'Static') {
      url += 'files.html'
    } else if (type === 'Collection') {
      url += 'collection.html'
    } else if (type === 'UserCollection') {
      url += 'usercollection.html'
    }

    this.set('documentation', url);
  }
});

module.exports = new App();
});
