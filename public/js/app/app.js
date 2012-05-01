define(function(require, exports, module) {

var CollectionSettings = require('./model/collection-settings');

var App = Backbone.Model.extend({
  defaults: {
      appName: 'My App'
    , appUrl: ''
    , resourceType: ''
  }

  , initialize: function() {
    this.on('change:resourceTypeId', this.setDocLink, this);
    this.on('change:resourceId', this.loadResource, this);
    this.on('change:authKey', function() {
      var authKey = this.get('authKey');
      if (authKey) {
        $.cookie('DPDAuthKey', authKey, {expires: 7});
      } else {
        $.cookie('DPDAuthKey', null);
      }
    }, this);

    this.set({
        appUrl: location.protocol + '//' + location.host
      , authKey: $.cookie('DPDAuthKey')
    });
    this.setDocLink();
  }

  , loadResource: function() {
    var self = this;
    if (self.get('resourceId')) {
      var resource = new Backbone.Model({_id: self.get('resourceId')});
      resource.url = '/resources/' + resource.id;
      resource.fetch({success: function() {
        
        self.set({
          resourceName: resource.get('path'),
          resourceType: resource.get('typeLabel'),
          resourceTypeId: resource.get('type')
        })

        if (resource.get('type') === 'UserCollection' || resource.get('type') === 'Collection') {
          var newResource = new CollectionSettings();
          newResource.set(newResource.parse(resource.attributes));  
          resource = newResource;
        }
        
        self.set({resource: resource});
      }});
    } else {
      self.set({resource: null});
    }
  }

  , setDocLink: function() {
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
