var PropertyTypeCollection = require('../model/property-type-collection');
var CollectionSettings = require('../model/collection-settings');

var ComponentTypeSidebarView = require('./component-type-sidebar-view');
var PropertyListView = require('./property-list-view');
var CollectionDataView = require('./collection-data-view');
var CollectionEventView = require('./collection-event-view');

var app = require('../app');
var undoBtn = require ('./undo-button-view');

var ModelEditorView = module.exports = Backbone.View.extend({

  events: {
    'click #save-btn': 'save'
  },

  initialize: function() {
    this.propertyTypes = new PropertyTypeCollection();
    // this.model.resourcePath = '/todos';

    this.dataCollection = new Backbone.Collection([]);
    this.dataCollection.url = this.model.get('path');
    this.dataCollection.fetch();

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

    this.model.on('change', this.enableSave, this);
    this.dataCollection.on('change:c_save', this.enableSave, this);
    this.dataCollection.on('change:c_delete', this.enableSave, this);
    this.dataCollection.on('add', this.enableSave, this);
    this.dataCollection.on('remove', this.enableSave, this);

    this.propertyTypes.fetch();

    this.initializeDom();
  },

  initializeDom: function() {
    this._keyevent = _.bind(this.onKeypress, this);
    $(window).keydown(this._keyevent);

    this.$('#save-btn').button();
    this.disableSave();
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
      this.model.save({}, {
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
  },

  render: function() {
    this.propertyListView.render();
    return this;
  },

  close: function() {
    $(window).off('keydown', this._keyevent);
    Backbone.View.prototype.close.call(this);
  }


});