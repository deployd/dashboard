define(function(require, exports, module) {
var PropertyTypeCollection = require('../model/property-type-collection');
var CollectionSettings = require('../model/collection-settings');
var DataCollection = require('../model/data-collection');

var PropertyListView = require('./property-list-view');
var CollectionDataView = require('./collection-data-view');
var CollectionEventView = require('./collection-event-view');

var app = require('../app');
var router = require('../router');
var undoBtn = require ('./undo-button-view');

var CollectionEditorView = module.exports = Backbone.View.extend({

  events: {
    'click #page-nav a': 'navigate'
  }

  , initialize: function() {
    this.propertyTypes = new PropertyTypeCollection();

    this.dataCollection = new DataCollection([]);
    this.dataCollection.path = this.model.get('path');
    this.dataCollection.fetch();

    this.model.on('change:path', function() {
      this.dataCollection.path = this.model.get('path');
    }, this);

    this.propertyListView = new PropertyListView({
      collection: this.model.get('properties')
      , typeCollection: this.propertyTypes
      , parentView: this
    });

    this.dataView = new CollectionDataView({
      properties: this.model.get('properties')
      , collection: this.dataCollection
    });

    this.eventsView = new CollectionEventView({
      el: this.$('#events-panel')
      , model: this.model
    }).render();

    this.model.on('change', this.save, this);

    this.propertyTypes.fetch();

    this.initializeDom();
  }

  , initializeDom: function() {
    this.onKeypress = _.bind(this.onKeypress, this);
    
    $('.icon-info-sign').popover();

    this._navSections = navSections = [];
    
    this.onScroll = _.bind(this.onScroll, this);
    $(window).on('scroll', this.onScroll);
    this.onScroll();
  }


  , save: function() {
    var self = this;
   
    this.model.save();
  }

  , onKeypress: function(e) {

    if ((e.ctrlKey || e.metaKey) && e.which == '83') { //Ctrl-S
      this.save();
      e.preventDefault();
      return false;
    }   
  }

  , onScroll: function(e) {
    var scrollTop = $(window).scrollTop();

    $('#page-nav').find('a').each(function() {
      var selector = $(this).attr('href');
      var $element = $(selector);
      var pos = $element.offset().top + $element.outerHeight();

      if (scrollTop < pos - 50) {

        $('#page-nav').find('.active').removeClass('active').end()
          .find('[href="' + selector + '"]').parent().addClass('active')
        ;

        return false;
      }
    });
  }

  , navigate: function(e) {
    var $link = $(e.currentTarget);
    var selector = $link.attr('href');

    $(window).scrollTop($(selector).offset().top - 50);

    return false;
  }


  , render: function() {
    this.propertyListView.render();
    return this;
  }

  , close: function() {
    Backbone.View.prototype.close.call(this);
    this.propertyListView.close();
    this.dataView.close();
    this.eventsView.close();
    $(window).off('scroll', this.onScroll);
  }


});

});
