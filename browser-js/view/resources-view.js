var ResourceSidebarView = require('./resource-sidebar-view');
var ResourceListView = require('./resource-list-view');

var ResourceCollection = require('../model/resource-collection');
var ResourceTypeCollection = require('../model/resource-type-collection');

var ResourcesView = module.exports = Backbone.Model.extend({
  el: 'body',

  initialize: function() {
    this.resourceTypes = new ResourceTypeCollection();
    this.resources = new ResourceCollection();

    this.resourceListView = new ResourceListView({
      collection: this.resources,
      parentView: this
    });
    this.resourceSidebarView = new ResourceSidebarView({
      collection: this.resourceTypes, 
      listView: this.resourceListView, 
      parentView: this
    });

    this.resourceTypes.fetch();
    this.resources.fetch();
  }
});