define(function(require, exports, module) {

var ComponentTypeSidebarView = require('./component-type-sidebar-view');
var ResourceListView = require('./resource-list-view');
var TemplateView = require('./template-view');

var ResourceCollection = require('../model/resource-collection');
var ResourceTypeCollection = require('../model/resource-type-collection');

var ResourcesView = module.exports = TemplateView.extend({
    el: '#resources-container'

  , template: 'resources-template'

  , typesTemplate: _.template($('#resource-types-template').html())

  , events: {
    'click #property-types a': 'addItem'
  }

  , initialize: function() {
    this.resources = this.options.resources;    
    this.resourceTypes = new ResourceTypeCollection();

    TemplateView.prototype.initialize.apply(this, arguments);

    this.resourceListView = new ResourceListView({
      collection: this.resources,
      typeCollection: this.resourceTypes,
      parentView: this
    });

    this.resourceTypes.on('reset', this.renderTypes, this);

    this.resourceTypes.fetch();
  }

  , addItem: function(e) {
    var typeCid = $(e.currentTarget).parents('li').attr('data-cid');
    var type = this.resourceTypes.getByCid(typeCid);

    this.resourceListView.addItem(type);
  }

  , renderTypes: function() {
    $('#property-types').html(this.typesTemplate({
      types: this.resourceTypes
    })).find('li').popover({
      placement: 'left'
    });
  }
});

});
