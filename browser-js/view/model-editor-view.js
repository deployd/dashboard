var PropertyTypeCollection = require('../model/property-type-collection');
var CollectionSettings = require('../model/collection-settings');

var ComponentTypeSidebarView = require('./component-type-sidebar-view');
var PropertyListView = require ('./property-list-view');

var ModelEditorView = module.exports = Backbone.View.extend({
  el: 'body',

  events: {
    'click #save-btn': 'save'
  },

  initialize: function() {
    this.propertyTypes = new PropertyTypeCollection();
    this.settings = new CollectionSettings();
    this.settings.resourcePath = '/todos';

    this.propertyListView = new PropertyListView({
      collection: this.settings.get('properties'),
      parentView: this
    });

    this.propertySidebarView = new ComponentTypeSidebarView({
      collection: this.propertyTypes, 
      listView: this.propertyListView, 
      parentView: this,
      template: _.template($('#property-sidebar-template').html()),
      el: '#property-sidebar'
    });

    this.settings.on('change', this.enableSave, this);

    this.propertyTypes.fetch();
    this.settings.fetch();

    this.initializeDom();
  },

  initializeDom: function() {
    $(window).keydown(_.bind(this.onKeypress, this));

    this.$('#save-btn').button().attr('disabled', true);
  },

  enableSave: function() {
    this.$('#save-btn').removeAttr('disabled');
  },

  save: function() {
    var $btn = this.$('#save-btn');
    if (!$btn.is('[disabled]')) {
      $btn.button('loading');
      this.settings.save({}, {
        success: function() {
          $btn.button('reset');
          setTimeout(function() {
            $btn.attr('disabled', 'disabled');  
          }, 0);
        }
      });
    }
  },

  onKeypress: function(e) {

    if ((e.ctrlKey || e.metaKey) && e.which == '83') { //Ctrl-S
      this.save();
      e.preventDefault();
      return false;
    }   
  }


});