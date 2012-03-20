var CodeEditorView = require('./code-editor-view.js');

var CollectionEventView = module.exports = Backbone.View.extend({

  template: _.template($('#events-template').html()),

  initialize: function() {
    this._editors = {
      onGet: null,
      onPost: null,
      onPut: null,
      onDelete: null
    };
  },

  update: function(e) {
    var values = {};

    _.each(this._editors, function(editor, name) {
      if (editor) {
        values[name] = editor.getText();
      }
    });

    console.log("Updating");

    this.model.set(values);
  },

  render: function() {
    var self = this;

    $(this.el).html(this.template(this.model.toJSON()));

    _.each(this._editors, function(editor, name) {
      if (editor) {
        editor.off();  
      }

      editor = new CodeEditorView({ el: self.$('#' + name) }).render();
      editor.on('change', self.update, self);
      self._editors[name] = editor;
    });

    return this;
  },

  close: function() {
    _.each(this._editors, function(editor, name) {
      if (editor) {
        editor.off();  
      }    
    });
  }

});