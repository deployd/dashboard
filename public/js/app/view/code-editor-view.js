define(["require", "exports", "module"], function(require, exports, module) {
var JavaScriptMode = ace.require("ace/mode/javascript").Mode;

var CodeEditorView = module.exports = Backbone.View.extend(Backbone.Events).extend({

  initialize: function() {
    _.bindAll(this, 'trackUpdate', 'update', 'render');
  },

  trackUpdate: function() {
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
  
  setText: function(val) {
    this.editor.getSession().setValue(val)
  },

  resize: function() {
    this.editor.resize();
  },

  render: function() {
    var view = this;
    var editor = ace.edit(this.el);
    editor.getSession().setMode(new JavaScriptMode());
    // editor.setTheme("ace/theme/vibrant_ink");
    editor.getSession().on('change', this.trackUpdate);
    editor.commands.addCommand({
        name: 'save',
        bindKey: {
            win: 'Ctrl-S',
            mac: 'Command-S'
        },
        exec: function(editor) {
          view.trigger('save');
        }
    });
    this.editor = editor;

    return this;
  }

});
});
