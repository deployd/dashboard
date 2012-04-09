define(["require", "exports", "module"], function(require, exports, module) {
var JavaScriptMode = ace.require("ace/mode/javascript").Mode;

var CodeEditorView = module.exports = Backbone.View.extend(Backbone.Events).extend({

  initialize: function() {
    _.bindAll(this, 'noteUpdate', 'update', 'render');
  },

  noteUpdate: function() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(this.update, 1000);
  },

  update: function() {
    this.trigger('change');
  },

  getText: function() {
    return this.editor.getSession().getValue()
  },

  resize: function() {
    this.editor.resize();
  },

  render: function() {
    
    var editor = ace.edit(this.el);
    editor.getSession().setMode(new JavaScriptMode());
    editor.setTheme("ace/theme/vibrant_ink");
    editor.getSession().on('change', this.noteUpdate);

    this.editor = editor;

    return this;
  }

});
});
