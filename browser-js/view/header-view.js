var Resource = require('../model/resource');

var saveStatus = require('./save-status-view');

var HeaderView = module.exports = Backbone.View.extend({
  el: '#header',

  template: _.template($('#header-template').html()),

  events: {
    'dblclick .resourceName': 'rename'
  },

  initialize: function() {
    this.model.on('change', this.render, this);
  },

  rename: function() {
    var resource = this.model.get('resource');
    var newName = prompt('Enter a new name for this ' + resource.get('type'), resource.get('path'));
    if (newName) {
      newName = Resource.sanitizePath(newName);
      resource.save({path: newName});
      this.model.set('resourceName', newName);
    }
    return false;
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    saveStatus.init(true);

    return this;
  }
});