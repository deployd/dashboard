define(function(require, exports, module) {

  var File = require('model/file');
  var Resource = require('model/resource');

  var app = require('app');

  var foldersMapping = {
    'folders': {
      key: function(data) {
        return ko.utils.unwrapObservable(data.path);
      }
    }
  };

  var template = exports.template = {

    eventIsButton: function(e) {
      var $target = $(e.target);
      if ($target.is('a') || $target.parentsUntil('.file, .folder').is('a')) {
        return true;
      } else {
        return false;
      }
    }

    , mapFiles: function() {
      this.files(this.model.get('data'));
    }

    , mapFolders: function() {
      var folders = [];
      var self = this;
      this.foldersCollection.each(function(folder) {
        var path = folder.get('path');
        if (path === '/') return; //Root is never going to be a subfolder
        var prefix = '/' + self.getPath('');

        if (path.indexOf(prefix) !== -1) { //Path should start with the current path
          var relPath = path.slice(prefix.length);
          //Path should not be the current (have relative length)
          //And not have any more levels
          if (relPath.length && relPath.indexOf('/') === -1) {

            var folderEntry = _.find(self.folders(), function(folder) {return folder.path === path});

            if (!folderEntry) {
              folder.urlRoot = self.foldersCollection.url;
              folderEntry = {
                  path: path
                , name: relPath
                , model: folder
                , isOpen: ko.observable(false)
                , viewModel: create(path)
              };
            }

            if (self.foldersToOpen[path]) {
              folderEntry.isOpen(true);
              delete self.foldersToOpen[path];
            }

            folders.push(folderEntry)
          } 
        }
      });

      self.folders(folders);
    }

    , fetch: function() {
      this.fetchFiles();
      this.fetchFolders();
      _.each(this.folders(), function(f) {
        if (f.isOpen()) {
          f.viewModel.fetch();
        }
      });
    }

    , fetchFolders: function() {
      this.foldersCollection.fetch();
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
      app.set('new file', false);
      app.set('files', this.getPath(filename));
    }

    , onClickFile: function(filename, e) {
      if (!this.eventIsButton(e)) {
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
      if (name) {
        app.set('new file', true);
        app.set('files', this.getPath(name));
      }
    }

    , deleteFolder: function(folder) {
      var self = this;
      folder.model.destroy({success: function() {
        self.fetchFolders();
      }});
    }

    , addFolder: function() {
      var name = prompt("Enter a name for this folder:");
      var self = this;
      if (name) {
        var resourcePath = Resource.sanitizePath(name);
        if (self.path !== '/') resourcePath = self.path + resourcePath;
        this.foldersCollection.create({
            path: resourcePath
          , type: 'Static'
        }, {success: function() {
          self.foldersToOpen[resourcePath] = true;
          self.fetchFolders();
        }});
      }
    }

    , toggleFolder: function(folder) {
      folder.isOpen(!folder.isOpen());
      if (folder.isOpen()) { folder.viewModel.fetch(); }
    }

    , onClickFolder: function(folder, e) {
      if (!this.eventIsButton(e)) {
        this.toggleFolder(folder);
      } else {
        return true;
      }
    }

  };

  function parseModel(json) {
    return {data: json};
  }

  function fetchFolders(options) {
    options = _.extend(options || {}, {
      data: {type: 'Static'}
    });
    return Backbone.Collection.prototype.fetch.call(this, options);
  }

  var create = exports.create = function(path) {
    path = path || '/';

    var self = Object.create(template);
    _.bindAll(self);

    self.path = path;

    self.model = new Backbone.Model();
    self.model.parse = parseModel;
    self.model.url = path;
    self.model.on('change:data', self.mapFiles, self);

    var foldersCollection = self.foldersCollection = new Backbone.Collection();
    foldersCollection.url = '/resources';
    foldersCollection.fetch = fetchFolders;
    foldersCollection.on('reset', self.mapFolders, self);

    self.foldersToOpen = {};

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