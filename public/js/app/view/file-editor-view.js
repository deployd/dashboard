define(["require", "exports", "module", '../app','../model/file', './code-editor-view'], function(require, exports, module) {

var app = require('../app');
var CodeEditorView = require('./code-editor-view');
var File = require('../model/file');

var saveStatus = require('./save-status-view');

var FileEditorView = module.exports = Backbone.View.extend(Backbone.Events).extend({

  events: {
      'click .back': 'back'
    , 'click #save-btn': 'save'
  }

  , initialize: function () {
    var path = this.path = '/' + app.get('edit');
    
    var view = this;

    var type = path.slice(path.indexOf('.') + 1);

    var editor = this.editor = new CodeEditorView({el: $('#editor'), mode: type}).render();
    editor.updateTime = 1;

    _.bind(view.save, view);
    
    editor.on('save', function () {
      view.save();
    })
  
    editor.on('change', function () {
      view.hasChanges();
    });
    
    $.get(path, function (data) {
      editor.setText(data);
    });
    
    var container = $('.editor-container');
    var win = $(window);
    
    win.resize(function () {
      container.height(win.height() - 200);
      editor.resize();
    });
    
    win.resize();
    
    view.saved();
  }

  , back: function() {
    app.unset('edit');

    return false;
  }

  , save: function() {
    var file = new File({path: this.path, data: this.editor.getText()});
    file.save({}, {success: function() {
      saveStatus.saved();
    }});
    this.saved();
    saveStatus.saving();
  }
  
  , hasChanges: function () {
    
    $('#file-status')
      .empty()
      .append('<i class="icon-file"></i> ' + this.link() + ' <i class="icon-asterisk"></i>')
    ;

    $('#save-btn').removeAttr('disabled');
  }

  , link: function() {
    return '<a href="' + this.path + '" target="_blank">'
       + this.path + '</a>';
  }
  
  , saved: function () {
     $('#file-status')
      .empty()
      .append('<i class="icon-file"></i> ' + this.link())
    ;

    $('#save-btn').attr('disabled', true);
  }

});


});