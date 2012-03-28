var PropertyTypeCollection = require('../model/property-type-collection');
var CollectionSettings = require('../model/collection-settings');

var ComponentTypeSidebarView = require('./component-type-sidebar-view');
var PropertyListView = require('./property-list-view');
var CollectionDataView = require('./collection-data-view');
var CollectionEventView = require('./collection-event-view');

var app = require('../app');
var router = require('../router');
var undoBtn = require ('./undo-button-view');

var ModelEditorView = module.exports = Backbone.View.extend({

  initialize: function() {
    this.propertyTypes = new PropertyTypeCollection();

    this.dataCollection = new Backbone.Collection([]);
    this.dataCollection.url = this.model.get('path');
    this.dataCollection.fetch();

    this.model.on('change:path', function() {
      this.dataCollection.url = this.model.get('path');
    }, this);

    this.propertyListView = new PropertyListView({
      collection: this.model.get('properties'),
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
      properties: this.model.get('properties'),
      collection: this.dataCollection
    });

    this.eventsView = new CollectionEventView({
      el: this.$('#events-panel'),
      model: this.model
    }).render();

    this.model.on('change', this.save, this);

    // this.dataCollection.on('change:c_save', this.enableSave, this);
    // this.dataCollection.on('change:c_delete', this.enableSave, this);
    // this.dataCollection.on('add', this.enableSave, this);
    // this.dataCollection.on('remove', this.enableSave, this);

    this.propertyTypes.fetch();

    // Backbone.history.on('load', this.onNavigate, this);

    this.initializeDom();
  },

  initializeDom: function() {
    this.onKeypress = _.bind(this.onKeypress, this);
    // this.onPageNavigate = _.bind(this.onPageNavigate, this);
    // $(window).keydown(this.onKeypress);
    // $(window).on('beforeunload', this.onPageNavigate);

    // this.$('#save-btn').button();
    // this.disableSave();
  },

  // enableSave: function() {
  //   this.$('#save-btn').removeAttr('disabled');
  // },

  // disableSave: function() {  
  //   var $btn = this.$('#save-btn');
  //   $btn.button('reset');
  //   setTimeout(function() {
  //    $btn.attr('disabled', true);
  //   }, 0);  
  // },

  save: function() {
    var self = this;
   
    this.model.save();
  },

  onKeypress: function(e) {

    if ((e.ctrlKey || e.metaKey) && e.which == '83') { //Ctrl-S
      this.save();
      e.preventDefault();
      return false;
    }   
  },

  // onNavigate: function(e) {

  //   if (!(this.$('#save-btn').is('[disabled]') || confirm('You have unsaved changes, are you sure you wish to navigate away from this page?'))) {      
  //     e.cancel = true;
  //     return false;
  //   }
    
  // },

  // onPageNavigate: function(e) {
  //   if (!this.$('#save-btn').is('[disabled]')) {
  //     return 'You have unsaved changes.';  
  //   }
  // },

  render: function() {
    this.propertyListView.render();
    return this;
  },

  close: function() {
    // $(window).off('keydown', this.onKeypress);
    // $(window).off('unload', this.onNavigate);
    // Backbone.history.off('load', this.onNavigate);
    Backbone.View.prototype.close.call(this);
  }


});
