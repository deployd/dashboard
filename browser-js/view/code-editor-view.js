var JavaScriptMode = ace.require("ace/mode/javascript").Mode;

var CodeEditorView = module.exports = Backbone.View.extend(Backbone.Events).extend({

  initialize: function() {
    _.bindAll(this, 'noteUpdate', 'update', 'render');
  },

  noteUpdate: function() {
    console.log("Change event");
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(this.update, 1000);
  },

  update: function() {
    console.log("Triggering change");
    this.trigger('change');
  },

  getText: function() {
    return this.editor.getSession().getValue()
  },

  render: function() {
    var editor = ace.edit(this.el);
    editor.getSession().setMode(new JavaScriptMode());
    editor.getSession().on('change', this.noteUpdate);

    this.editor = editor;

    return this;
  }
});