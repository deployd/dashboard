define(["require", "exports", "module"], function(require, exports, module) {
var JavaScriptMode = ace.require("ace/mode/javascript").Mode;
var CssMode = ace.require("ace/mode/css").Mode;
var HtmlMode = ace.require("ace/mode/html").Mode;

var $editorEl = $('<div>');
var _editor;

function getEditor(el) {
  if (!_editor) {
    _editor = ace.edit($editorEl[0]);
    _editor.setTheme("ace/theme/deployd");
    _editor.setShowPrintMargin(false);
  }

  $(el).append($editorEl);

  return _editor;
}

var CodeEditorView = module.exports = Backbone.View.extend(Backbone.Events).extend({

  initialize: function() {
    this.mode = this.options.mode;
    _.bindAll(this, 'trackUpdate', 'update', 'render');
  },

  trackUpdate: function() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    var length = this.updateTime || 1000;

    this._timeout = setTimeout(this.update, length);
  },

  update: function() {
    this.trigger('change');
  },

  getText: function() {
    if (!this.editor) return undefined;
    return this.editor.getSession().getValue()
  },
  
  setText: function(val) {
    this.editor.getSession().setValue(val);
    clearTimeout(this._timeout);
  },

  resize: function() {
    this.editor.resize();
  },

  render: function() {
    var view = this;
    var editor = getEditor(this.el);
    editor.resize();
    var mode = this.mode || 'js';
    if (mode === 'html' || mode === 'htm') {
      editor.getSession().setMode(new HtmlMode());  
    } else if (mode === 'css') { 
      editor.getSession().setMode(new CssMode());
    } else if (mode === 'js') {
      editor.getSession().setMode(new JavaScriptMode());  
    }
    
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

    editor.focus();

    return this;
  }

  , close: function() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this.off();
    this.setText('');
  }

});
});
