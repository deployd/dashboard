define(["require", "exports", "module", "./app","./view/save-status-view"], function(require, exports, module) {
var app = require('./app');
var saveStatus = require('./view/save-status-view');

Backbone.View.prototype.close = function () {
  this.remove();
  this.unbind();
};

var oldSync = Backbone.sync;
Backbone.sync = function(method, model, options) {
  var url = _.isFunction(model['url']) ? model['url']() : model['url'];
  url = app.get('appUrl') + url;

  if (method === 'create' || method === 'update' || method === 'delete') {
    saveStatus.saving();
    var lastSuccess = options.success;
    var lastError = options.error;
    var success = function() {
      saveStatus.saved();
      if (lastSuccess) {
        lastSuccess.apply(this, arguments);
      }
    }
    var error = function() {
      saveStatus.error();
      if (lastError) {
        lastError.apply(this, arguments);
      }
    }
    options.success = success;
    options.error = error;
  }

  if (method === 'create' || method === 'update') {
    var data = options.data || model.toJSON();
    if(typeof data != 'string') {
      Backbone.Utils.removeClientValues(data);
      options.contentType = 'application/json';
      options.data = JSON.stringify(data);
    }
  }

  options.headers = {
    'dpd-ssh-key': app.get('authKey') || true
  };

  options.url = options.url || url;
  return oldSync(method, model, options);
};

var oldCheckUrl = Backbone.History.prototype.checkUrl;
Backbone.History.prototype.checkUrl = function(e) {
  this._lastFragment = this.fragment;
  
  if (this.getFragment() !== this.fragment) {
    var loadEvent = {cancel: false};
    this.trigger('load', loadEvent);
    if (loadEvent.cancel) {
      this.navigate(this.fragment, {trigger: true, replace: true});
      e.preventDefault();
      window.location.hash = this.fragment;
      return false;
    }
  }
  

  oldCheckUrl.apply(this, arguments);  
}

// var oldLoadUrl = Backbone.History.prototype.loadUrl;
// Backbone.History.prototype.loadUrl = function(fragmentOverride) {
//   var fragment = this.getFragment(fragmentOverride);
  
//   if (this.fragment !== this._lastFragment) {
//     var e = {cancel: false};
//     this.trigger('load', e);
//     if (e.cancel) {
//       console.log('Going to', this._lastFragment);
//       this.navigate(this._lastFragment, {trigger: true, replace: true});
//       return;
//     }  

//     oldLoadUrl.apply(this, arguments);  
//   }
  
  
// };



Backbone.Utils = Backbone.Utils || {};
Backbone.Utils.removeClientValues = function(json) {
  if (isArray(json)) {
    _.each(json, function(val, index) {
      if (typeof val === 'object') {
        Backbone.Utils.removeClientValues(val);
      }
    });
  } else {
    _.each(json, function(val, key) {
      if (_.str.startsWith(key, 'c_')) {
        delete json[key];
      } else if (typeof val === 'object') { //Will also catch arrays
        Backbone.Utils.removeClientValues(val);
      }
    });
   }
   return json;
};
Backbone.Utils.parseDictionary = function(resp, options) {
  var defaults = {
    keyProperty: 'label'
  }
  options = _.defaults(options || {}, defaults);

  var keys = Object.keys(resp);
  var result = [];

  _.each(keys, function(key) {
    var model = resp[key];
    model.id = key;
    model[options.keyProperty] = model[options.keyProperty] || key;
    result.push(model);
  });

  return result;
};

Backbone.Utils.toJSONDictionary = function(json, options) {
 var defaults = {
    keyProperty: 'label'
  }
  _.defaults(options, defaults);

  var result = {};

  _.each(json, function(model) {
    var key = model[options.keyProperty];
    delete model[options.keyProperty];

    result[key] = model;
  });

  return result;
};

Backbone.Utils.cancelEvent = function(e) {
  return false;
};

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}
});
