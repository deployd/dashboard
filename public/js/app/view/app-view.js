define(function(require, exports, module) {

  var app = require('../app');
  var router = require('../router');

  var undoBtn = require('./undo-button-view');
  var saveStatus = require('./save-status-view');

  var ResourceCollection = require('../model/resource-collection');

  var AuthModalView = require('./auth-modal-view');
  var ResourceSidebarView = require('./resource-sidebar-view');
  var ResourcesView = require('./resources-view');
  var HeaderView = require('./header-view');

  var CollectionView = require('./collection-view');
  var StaticView = require('./static-view');
  var FileEditorView = require('./file-editor-view');

  var AppView = module.exports = Backbone.View.extend({

    initialize: function() {

    this.resources = new ResourceCollection();

    this.modal = new AuthModalView();

    this.authenticate();
    this.resources.fetch();
    // app.on('change:authKey', this.authenticate, this);
    this.resources.on('reset', this.initRender, this);
    this.resources.on('error', this.modal.showError, this.modal);
  }

  , authenticate: function() {

    this.resources.fetch();  

    // if (app.get('authKey')) {
    //   this.resources.fetch();  
    // } else {
    //   this.modal.show();
    // }

  }

  , initRender: function() {
    this.resourceSidebarView = new ResourceSidebarView({collection: this.resources});
    this.resourceView = new ResourcesView({resources: this.resources});
    this.headerView = new HeaderView({model: app});

    this.resources.off('reset', this.initRender, this);

    app.on('change:resource', this.render, this);
    app.on('change:files', this.render, this);

    this.render();
  }

  , render: function() {

    if (this.bodyView) {
      this.bodyView.close();
    }

    var resource = app.get('resource');

    var files = app.get('files');

    if (app.get('resourceId') || files) {

      
      
      var viewClass = null;

      if (files) {

        if (files !== true) {
          viewClass = FileEditorView;  
        } else {
          viewClass = StaticView;
        }
        
      } else if (resource) {
        var type = resource.get('type');
        if (type === 'Collection' || type === 'UserCollection') {
          viewClass = CollectionView;
        }
      }

      if (viewClass) {
        var el = $('<div>');
        $('#body').empty().append(el);
        this.bodyView = new viewClass({model: resource, el: el});
      }

      $('#body-container').show();
      $('#resources-container').hide();

      if (files) {
        var path = "/files";
        if (files !== true) {
          path += '/' + files;
        }
        router.navigate(path);
      } else {
        router.navigate(app.get('resourceId'));
      }
    } else {
      $('#body-container').hide();
      $('#resources-container').show();

      this.resources.fetch();

      router.navigate('');
    }



    undoBtn.init();
    saveStatus.init();
  }

  });

  var instance;

  AppView.init = function() {
    if (!instance) { instance = new AppView(); }
    return instance;
  };

});