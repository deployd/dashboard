define(function(require, exports, module) {
var CollectionSettings = require('../model/collection-settings');
var ResourceCollection = require('../model/resource-collection');

var ResourcesView = require('./resources-view');
var ResourceSidebarView = require('./resource-sidebar-view');
var CollectionView = require('./collection-view');
var StaticView = require('./static-view');
var HeaderView = require('./header-view');
var FileEditorView = require('./file-editor-view');

var undoBtn = require('./undo-button-view');
var saveStatus = require('./save-status-view');

var app = require('../app');
var router = require('../router');

var AppView = module.exports = Backbone.View.extend({

  headerTemplate: _.template($('#header-template').html()),

  resourcesTemplate: _.template($('#resources-template').html()),
  collectionTemplate: _.template($('#collection-template').html()),
  staticTemplate: _.template($('#static-template').html()),
  fileEditorTemplate: _.template($('#file-editor-template').html()),

  events: {
    'click #authModal .save': 'authenticate'
  },

  initialize: function() {
    this.model = this.model || app;
    this.model.on('change:resourceId', this.loadResource, this);
    this.model.on('change:resource', this.render, this);
    this.model.on('change:edit', this.render, this);

    this.headerView = new HeaderView({model: app});

    this.resources = new ResourceCollection();

    $('#resources-container').html(this.resourcesTemplate({
    }));

    this.$modal = $('#authModal').modal();

    var appUrl = location.protocol + '//' + location.host;

    app.set({
      appUrl: appUrl,
      authKey: $.cookie('DPDAuthKey')
    })

    app.on('change:authKey', this.showModal, this);

    this.$modal.on('click', '.save', _.bind(this.authenticate, this));

    this.showModal();

  },

  showModal: function() {
    if (app.get('appUrl') && app.get('authKey')) {
      this.$modal.modal('hide');
    } else {
      this.$modal.modal('show');
    }
  },

  authenticate: function() {
    app.set({
      authKey: this.$modal.find('[name=key]').val()
    });

    $.cookie('DPDAuthKey', app.get('authKey'), {expires: 7});

    this.$modal.modal('hide');
    this.render();

    return false;
  },

  loadResource: function() {
    var self = this;
    if (this.model.get('resourceId')) {
      var resource = new Backbone.Model({_id: self.model.get('resourceId')});
      resource.url = '/resources/' + resource.id;
      resource.fetch({success: function() {
        var newResource = new CollectionSettings();
        app.set({
          resourceName: resource.get('path'),
          resourceType: resource.get('typeLabel'),
          resourceTypeId: resource.get('type')
        })
        newResource.set(newResource.parse(resource.attributes));
        self.model.set({resource: newResource});
      }});
    } else {
      self.model.set({resource: null});
    }
  },

  render: function() {
    if (!this.resourcesView && !this.resourceSidebarView) {
      this.resourcesView = new ResourcesView({el: '#resources-container', resources: this.resources});
      this.resourceSidebarView = new ResourceSidebarView({collection: this.resources});
    }

    var model = this.model.toJSON();
    var template, bodyViewClass;
    var resourceId = this.model && this.model.get('resourceId');
    var type = this.model && resourceId && this.model.get('resourceTypeId');
    var edit = (this.model && this.model.get('edit')) || false;
    
    if(edit) {
      template = this.fileEditorTemplate;
      bodyViewClass = FileEditorView;
    } else if (type === 'Collection' || type === 'UserCollection') {
      template = this.collectionTemplate;
      bodyViewClass = CollectionView;
    } else if(type === 'Static') {
      template = this.staticTemplate;
      bodyViewClass = StaticView;
    } else {
      app.set({resourceType: ''});
      app.set({resourceName: ''});
    }

    if (bodyViewClass) {
      var body = $('<div id="body" class="span9">').html(template(model));
      $('#body').replaceWith(body);
      require('./divider-drag')();
      
      $(window).resize();

      if (this.bodyView) {
        this.bodyView.close();
      }

      this.bodyView = new bodyViewClass({el: body, model: this.model.get('resource')});  
      this.bodyView.render();

      $('#body-container').show();
      $('#resources-container').hide();
    } else {
      $('#body-container').hide();
      $('#resources-container').show();
    }

    
    this.resources.fetch();
    undoBtn.init();
    saveStatus.init();

    if (edit) {
      router.navigate('/edit/' + edit);
    } else {
      router.navigate(this.model.get('resourceId'));
    }
  },

});

});
