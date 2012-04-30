define(function(require, exports, module) {

var TemplateView = require('./template-view');
var app = require('../app');

var ResourceSidebarView = module.exports = TemplateView.extend({
    el: '#resource-sidebar'
  , template: 'resource-sidebar-template'

  , initialize: function() {

    app.on('change:resourceId', this.render, this);

    TemplateView.prototype.initialize.apply(this, arguments);
  }

  , templateData: function() {
    return _.extend(TemplateView.prototype.templateData.apply(this), {  
      app: app.toJSON()
    });
  }

});

});