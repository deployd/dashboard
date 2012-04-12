define(["require", "exports", "module"], function(require, exports, module) {
var App = Backbone.Model.extend({
  defaults: {
    appName: 'My App',
    appUrl: '',
    resourceType: ''
  },

  initialize: function() {
    this.on('change:resourceTypeId', this.setDocLink, this);
    this.setDocLink();
  },

  setDocLink: function() {
    var type = this.get('resourceTypeId');
    var url = 'http://deployd.github.com/deployd/';
    if (type === 'Static') {
      url += '#Files-Resource'
    } else if (type === 'Collection') {
      url += '#Collection-Resource'
    } else if (type === 'UserCollection') {
      url += '#User-Collection-Resource'
    }

    this.set('documentation', url);
  }
});

module.exports = new App();
});
