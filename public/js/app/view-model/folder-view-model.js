define(function(require, exports, module) {

  var File = require('model/file');

  var app = require('app');

  var template = exports.template = {

    mapFiles: function() {
      this.files(this.model.get('data'));
    }

    , fetchFiles: function() {
      this.model.fetch();
    }

    , getPath: function(filename) {
      var path = this.path.slice(1);
      if (this.path !== '/') path += '/';
      return path + filename;
    }

    , deleteFile: function(filename) {
      var file = new File({path: '/', info: {fileName: filename}, _id: filename});
      var self = this;
      
      file.destroy({success: function () {
        self.fetchFiles();
      }});
    }

    , editFile: function(filename) {
      app.set('files', this.getPath(filename));
    }

    , onClickFile: function(filename, e) {
      if (!$(e.target).is('a')) {
        this.editFile(filename);
      } else {
        return true;
      }
    }

    , onChangeUpload: function(data, e) {
      var files = e.target.files && e.target.files
        , self = this
      ;

      _.each(files, self.uploadFile);
    }

    , uploadFile: function(file) {
      var f = new File({info: file, path: this.path});
      var name = file.fileName;
      var self = this;

      this.uploadingFiles.push(name);

      f.on('sync', function () {
        self.fetchFiles();
        self.uploadingFiles.remove(name);
      });

      f.save();
      
    }

    , addFile: function() {
      var name = prompt("Enter a name for this file, including the extension:");
      if (name) this.editFile(name);
    }

  };

  function parseModel(json) {
    return {data: json};
  }

  exports.create = function create(path) {
    path = path || '/';

    var self = Object.create(template);
    _.bindAll(self);

    self.path = path;

    self.model = new Backbone.Model();
    self.model.parse = parseModel;
    self.model.url = path;
    self.model.on('change:data', self.mapFiles, self);

    self.files = ko.observableArray();
    self.folders = ko.observableArray();
    self.uploadingFiles = ko.observableArray();

    self.uploadingText = ko.computed(function() {
      var count = this.uploadingFiles().length;
      if (count == 1) {
        return "Uploading " + this.uploadingFiles()[0] + "...";
      } else if (count) {
        return "Uploading " + count + " files...";
      }

      return "";
    }, self);

    return self;

  }

});