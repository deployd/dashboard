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

    this.model.set(values);
  },

  render: function() {
    var self = this;

    setInterval(_.bind(this.resize, this), 1000);

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

  resize: function() {
    var $editors = $(this.el).find('.editor-container');
    $editors.height(0);

    var availableSpace = $(this.el).height();

    $(this.el).children().each(function() {
      availableSpace -= $(this).outerHeight(true);
    });

    $editors.height(availableSpace);

    _.each(this._editors, function(editor, name) {
      if (editor) {
        editor.resize();  
      }
    });
  },

  close: function() {
    _.each(this._editors, function(editor, name) {
      if (editor) {
        editor.off();  
      }    
    });
  }

});