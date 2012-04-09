define(function(require, exports, module) {
var CodeEditorView = require('./code-editor-view');

var CollectionEventView = module.exports = Backbone.View.extend({

  template: _.template($('#events-template').html()),

  events: {
    'shown .nav-tabs a': 'resize'
  },

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

    this._resizeInterval = setInterval(_.bind(this.resize, this), 100);

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

  resize: function(force) {
  
    var height = $(this.el).height();

    if (this._lastHeight !== height || force) {
      var $editors = $(this.el).find('.editor-container');
      $editors.height(0);

      var availableSpace = height;

      $(this.el).children().each(function() {
        availableSpace -= $(this).outerHeight(true);
      });

      $editors.height(availableSpace);

      _.each(this._editors, function(editor, name) {
        if (editor) {
          editor.resize();  
        }
      });

      this._lastHeight = height;
    }
    
  },

  close: function() {
    clearInterval(this._resizeInterval);
    _.each(this._editors, function(editor, name) {
      if (editor) {
        editor.off();  
      }    
    });
  }

});
});
