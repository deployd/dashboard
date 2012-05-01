define(function(require, exports, module) {
var app = require('../app')
  , File = require('../model/file')
  , fileTemplate = _.template($('#file-template').html())
  , template = _.template($('#static-template').html())
;

var ModelEditorView = module.exports = Backbone.View.extend({
  
    events: {
      'change #file-upload input': 'onChange'
    , 'click .new-file-btn': 'addFile'
    , 'click a.delete': 'delete'
  }
  
  , initialize: function () {
    this.initializeDom();

    this.list = this.$('#files tbody');
    this.files = new Backbone.Model();
    this.files.parse = function (data) {
      return {all: data}
    };
    this.files.url = this.model.get('path');
    this.files.on('change:all', this.render, this);
    this.files.fetch();
  }

  , initializeDom: function() {
    $(this.el).html(template({}));
  }
  
  , render: function (model, data, options) {
    var list = this.list
      , html = ''
      , model = this.model
      , path = model.get('path')
    ;
    
    if(path === '/') path = '';
    
    if(data) {
      _.each(data.reverse(), function (filename) {
        html += fileTemplate({
          filename: filename,
          url: app.get('appUrl') + path + '/' + filename,
          path: path + '/' + filename,
          isEditable: isEditable(filename)
        });
      })
    }

    if (this.files.get('all') && this.files.get('all').length) {
      $('#files').show();
      $('#files-empty').hide();
    } else {
      $('#files').hide();
      $('#files-empty').show();
    }
    
    list.html(html);
    
    return this;
  },
  
  onChange: function (e) {
    var files = e.target.files && e.target.files
      , path = this.model.get('path')
      , self = this
    ;
    
    _.each(files, function (file) {
      var f = new File({info: file, path: path});

      var $status = $('<div>').text('Uploading ' + file.fileName + '...')
        .appendTo(self.$('#currentUploads'));

      f.on('sync', function () {
        self.files.fetch();
        $status.fadeOut(500, function() {
          $status.remove();
        })
      });

      f.save();
    
    });
  },
  
  delete: function (e) {
    var filename = $(e.currentTarget).attr('filename')
      , file = new File({path: this.model.get('path'), info: {fileName: filename}, _id: filename});
    
    var files = this.files;
    
    file.destroy({success: function () {
      files.fetch();
    }});
    
    return false;
  }

  , addFile: function() {
    var name = prompt("Enter a name for this file, including the extension:");
    var path = this.files.url;
    if (path === '/') {
      path = ''
    }  else {
      path = path.slice(1) + '/'
    }

    if (name) {
      app.set('edit', path + name);
    }

    return false;
  }
  
});

var editables = {
  // txt:1,
  // js:1,
  // html:1,
  // css:1,
  // ejs:1,
  // less:1
}

function isEditable(filename) {
  return editables[extension(filename)];
}

function extension(filename) {
  if(!filename) return;
  
  var lastDot = -1, i = 0;
  
  while(i < (filename ? filename.length : 0)) {
    if(filename[i++] === '.') lastDot = i;
  }
  
  return filename.substr(lastDot, filename.length);
}

});
