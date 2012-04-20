define(["require", "exports", "module", '../app','../model/file', './code-editor-view'], function(require, exports, module) {

var app = require('../app');
var CodeEditorView = require('./code-editor-view');
var File = require('../model/file');

var FileEditorView = module.exports = Backbone.View.extend(Backbone.Events).extend({

  events: {
    'click .back': 'back'
  }

  , initialize: function () {
    var path = this.path = '/' + app.get('edit');
    
    var view = this;
    var editor = new CodeEditorView({el: $('#editor')}).render();
    
    editor.on('save', function () {
      var file = new File({path: path, data: editor.getText()});
      file.save();
      view.saved();
    })
  
    editor.on('change', function () {
      view.hasChanges();
    });
    
    $.get(path, function (data) {
      editor.setText(data);
    });

    view.saved();
  }

  , back: function() {
    app.unset('edit');

    return false;
  }
  
  , hasChanges: function () {
    
    $('#file-status')
      .empty()
      .append('<i class="icon-asterisk"></i> ' + this.path)
    ;
  }
  
  , saved: function () {
     $('#file-status')
      .empty()
      .append('<i class="icon-file"></i> ' + this.path)
    ;
  }

});


});