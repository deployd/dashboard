define(function(require, exports, module) {
var CodeEditorView = require('./code-editor-view');

var CollectionEventView = module.exports = Backbone.View.extend({

    template: _.template($('#events-template').html())

  , events: {
    'click #event-nav a': 'updateRender'
  }

  , initialize: function() {

    var self = this;

    $(this.el).html(this.template(this.model.toJSON()));


    this.editor = new CodeEditorView({ }).render();
    this.editor.on('change', self.update, self);

    this.resize = _.bind(this.resize, this);
    $('#resource-sidebar').on('click', 'a', this.resize);
  }

  , getActive: function() {
    return this.$('#event-nav .active a').attr('data-editor');
  }

  , update: function(e) {
    var text = this.editor.getText();
    if (typeof text !== 'undefined') this.model.set(this.getActive(), text);
  }

  , updateRender: function() {
    this.update();

    setTimeout(_.bind(this.render, this), 1);
  }

  , render: function() {

    var active = this.getActive();


    this.editor.setText(this.model.get(active));
    this.editor.setElement('#' + active);
    this.editor.render();
    
    return this;
  }

  , resize: function() {
    setTimeout(_.bind(this.editor.resize, this), 1);
  }

  , close: function() {
    $('#resource-sidebar').off('click', 'a', this.resize);
    this.editor.close();    
  }

});
});
