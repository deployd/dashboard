define(function(require, exports, module) {
var CodeEditorView = require('./code-editor-view');

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

    this.model.set(values);
  },

  render: function() {
    var self = this;

    $(this.el).html(this.template(this.model.toJSON()));

    _.each(this._editors, function(editor, name) {
      if (editor) {
        editor.close();  
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
        editor.close();  
      }    
    });
  }

});
});
