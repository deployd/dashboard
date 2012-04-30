define(function(require, exports, module) {
var PropertyTypeCollection = require('../model/property-type-collection');
var CollectionSettings = require('../model/collection-settings');
var DataCollection = require('../model/data-collection');

var PropertyListView = require('./property-list-view');
var PropertyReferenceView = require('./property-reference-view');
var CollectionDataView = require('./collection-data-view');
var CollectionEventView = require('./collection-event-view');
var CollectionRoutesView = require('./collection-routes-view');


var app = require('../app');
var router = require('../router');
var undoBtn = require ('./undo-button-view');

var CollectionView = module.exports = Backbone.View.extend({

  events: {
    'click .cta-link': 'onClickCta'
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

    this.PropertyReferenceView = new PropertyReferenceView({
      model: this.model
    });

    this.dataView = new CollectionDataView({
      properties: this.model.get('properties')
      , collection: this.dataCollection
    });

    this.routesView = new CollectionRoutesView({
      model: this.model
    });

    this.eventsView = new CollectionEventView({
      el: this.$('#events-panel')
      , model: this.model
    }).render();

    this.model.on('change', this.save, this);

    this.dataCollection.on('reset', this.render, this);
    this.model.on('change', this.render, this);

    this.propertyTypes.fetch();

    this.initializeDom();

    this.render();
  }

  , initializeDom: function() {
    this.onKeypress = _.bind(this.onKeypress, this);
    
    $('.icon-info-sign').popover();

    this._navSections = navSections = [];
    
    this.onScroll = _.bind(this.onScroll, this);
    $(window).on('scroll', this.onScroll);
    this.onScroll();

    if (this.model.get('properties').length) {
      this.$('#resource-sidebar a[href="#data"]').click();
    } else {
      this.$('#resource-sidebar a[href="#properties"]').click();
    }
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
    // var scrollTop = $(window).scrollTop();

    // $('#page-nav').find('a').each(function() {
    //   var selector = $(this).attr('href');
    //   var $element = $(selector);
    //   var pos = $element.offset().top + $element.outerHeight();

    //   if (scrollTop < pos - 50) {

    //     $('#page-nav').find('.active').removeClass('active').end()
    //       .find('[href="' + selector + '"]').parent().addClass('active')
    //     ;

    //     return false;
    //   }
    // });
  }

  , onClickCta: function(e) {
    var href = $(e.currentTarget).attr('href');
    var $navLink = $('#resource-sidebar a[href="' + href + '"]');
    $navLink.click(); //Proxy click to navbar

    return false;
  }

  , navigate: function(e) {
    var $link = $(e.currentTarget);
    var selector = $link.attr('href');

    $(window).scrollTop($(selector).offset().top - 50);

    return false;
  }


  , render: function() {
    var $nowWhat = $('#property-now-what');
    if (this.model.get('properties').length && !this.dataCollection.length) {
      $nowWhat.show();
    } else {
      $nowWhat.hide();
    }
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
