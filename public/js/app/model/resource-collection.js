define(function(require, exports, module) {
var Resource = require('../model/resource');

var app = require('../app');

var ResourceCollection = module.exports = Backbone.Collection.extend({
    model: Resource
  , url: '/resources'

  , initialize: function() {
    this.on('error', this.error, this);
  }

  , comparator: function(resource) {
    return resource.get('order');
  }

  , error: function() {
    app.set({authKey: undefined}, {silent: true});
    app.trigger('change:authKey');
  }

  , fetch: function(options) {
    options = _.extend(options || {}, {
      data: {q: '{"type": {"$ne": "Static"}}'}
    });
    Backbone.Collection.prototype.fetch.call(this, options);
  }
});
});
