var PropertyTypeCollection = require('../model/property-type-collection');
var CollectionSettings = require('../model/collection-settings');

var ComponentTypeSidebarView = require('./component-type-sidebar-view');
var PropertyListView = require ('./property-list-view');

var ModelEditorView = module.exports = Backbone.View.extend({
  el: 'body',

  initialize: function() {
    this.propertyTypes = new PropertyTypeCollection();
    this.settings = new CollectionSettings();
    this.settings.resourcePath = '/todos';

    this.propertyList = new PropertyListView({
      collection: this.settings.get('properties'),
      parentView: this
    });

    this.propertySidebarView = new ComponentTypeSidebarView({
      collection: this.propertyTypes, 
      listView: this, 
      parentView: this,
      template: _.template($('#property-sidebar-template').html()),
      el: '#property-sidebar'
    });

    this.propertyTypes.fetch();
    this.settings.fetch();
  }
});