var PropertyTypeCollection = require('../model/property-type-collection');
var CollectionSettings = require('../model/collection-settings');

var ComponentTypeSidebarView = require('./component-type-sidebar-view');
var PropertyListView = require('./property-list-view');
var CollectionDataView = require('./collection-data-view');

var undoBtn = require ('./undo-button-view');

var ModelEditorView = module.exports = Backbone.View.extend({
  el: 'body',

  events: {
    'click #save-btn': 'save'
  },

  initialize: function() {
    this.propertyTypes = new PropertyTypeCollection();
    this.settings = new CollectionSettings();
    this.settings.resourcePath = '/todos';

    this.dataCollection = new Backbone.Collection([]);
    this.dataCollection.url = '/todos';

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

    this.dataView = new CollectionDataView({
      properties: this.settings.get('properties'),
      collection: this.dataCollection
    });

    this.settings.on('change', this.enableSave, this);
    this.dataCollection.on('change:c_save', this.enableSave, this);
    this.dataCollection.on('change:c_delete', this.enableSave, this);
    this.dataCollection.on('add', this.enableSave, this);
    this.dataCollection.on('remove', this.enableSave, this);

    this.propertyTypes.fetch();
    this.settings.fetch();
    this.dataCollection.fetch();

    this.initializeDom();
  },

  initializeDom: function() {
    $(window).keydown(_.bind(this.onKeypress, this));

    this.$('#save-btn').button();
  },

  enableSave: function() {
    this.$('#save-btn').removeAttr('disabled');
  },

  disableSave: function() {  
    var $btn = this.$('#save-btn');
    $btn.button('reset');
    setTimeout(function() {
     $btn.attr('disabled', true);
    }, 0);  
  },

  save: function() {
    var self = this;
    var $btn = this.$('#save-btn');
    if (!$btn.is('[disabled]')) {
      $btn.button('loading');
      this.settings.save({}, {
        success: function() {
          self.dataView.save(function() {
            undoBtn.hide();
            self.dataCollection.fetch();
            self.disableSave();  
          });
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