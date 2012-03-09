var ResourcesView = require('./resources-view');
var ModelEditorView = require('./model-editor-view');
var HeaderView = require('./header-view');

var undoBtn = require('./undo-button-view');

var app = require('../app');
var router = require('../router');

var AppView = module.exports = Backbone.View.extend({

  headerTemplate: _.template($('#header-template').html()),

  resourcesTemplate: _.template($('#resources-template').html()),
  collectionTemplate: _.template($('#collection-template').html()),

  events: {
    'click #authModal .save': 'authenticate'
  },

  initialize: function() {
    this.model = this.model || app;
    this.model.on('change:resourceId', this.render, this);

    this.headerView = new HeaderView({model: app});

    this.$modal = $('#authModal').modal();

    app.set({
      appUrl: $.cookie('DPDAppUrl'),
      authKey: $.cookie('DPDAuthKey')
    })

    if (app.get('appUrl') && app.get('authKey')) {
      this.$modal.modal('hide');
    } else {
      this.$modal.on('click', '.save', _.bind(this.authenticate, this));
    }

    

  },

  authenticate: function() {
    app.set({
      appUrl: this.$modal.find('[name=appUrl]').val(),
      authKey: this.$modal.find('[name=key]').val()
    });

    this.$modal.modal('hide');
    this.render();

    return false;
  },

  render: function() {
    var model = this.model.toJSON();
    var template, bodyViewClass;

    if (this.model.get('resourceId')) {
      template = this.collectionTemplate;
      bodyViewClass = ModelEditorView;
    } else {
      app.set({resourceType: ''});
      app.set({resourceName: ''});
      template = this.resourcesTemplate;
      bodyViewClass = ResourcesView;
    }

    var body = $('#body').html(template(model));
    this.bodyView = new bodyViewClass({el: body});  

    undoBtn.init();
  },

});