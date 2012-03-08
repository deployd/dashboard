var ResourcesView = require('./resources-view');
var ModelEditorView = require('./model-editor-view');

var undoBtn = require('./undo-button-view');

var app = require('../app');
var router = require('../router');

var AppView = module.exports = Backbone.View.extend({

  headerTemplate: _.template($('#header-template').html()),

  resourcesTemplate: _.template($('#resources-template').html()),
  collectionTemplate: _.template($('#collection-template').html()),

  initialize: function() {
    this.model = this.model || app;
    this.model.on('change:resourceName', this.render, this);

    // Use delegation to avoid initial DOM selection and allow all matching elements to bubble
    $(document).on('click', 'a', function(evt) {
      // Get the anchor href and protcol
      var href = $(this).attr("href");
      var protocol = this.protocol + "//";

      // Ensure the protocol is not part of URL, meaning its relative.
      // Stop the event bubbling to ensure the link will not cause a page refresh.
      if (href.slice(protocol.length) !== protocol) {
        evt.preventDefault();

        // Note by using Backbone.history.navigate, router events will not be
        // triggered.  If this is a problem, change this to navigate on your
        // router.
        router.navigate(href, {trigger: true});
      }
    });
  },

  render: function() {
    var model = this.model.toJSON();
    var template, bodyViewClass;

    $('#header').html(this.headerTemplate(model));

    if (this.model.get('resourceType')) {
      template = this.collectionTemplate;
      bodyViewClass = ModelEditorView;
    } else {
      template = this.resourcesTemplate;
      bodyViewClass = ResourcesView;
    }

    var body = $('#body').html(template(model));
    this.bodyView = new bodyViewClass({el: body});  

    undoBtn.init();
  },

});