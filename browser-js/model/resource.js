var Resource = module.exports = Backbone.Model.extend({ 
  defaults: {
    path: '',
    order: 0
  },

  initialize: function() {
  	this.on('change:path', this.sanitizePath, this);
  },

  sanitizePath: function() {
  	var path = this.get('path');
  	path = Resource.sanitizePath(path);
  	if (path !== this.get('path')) {
  		this.set({path: path});	
  	}
  }
});

Resource.sanitizePath = function(path) {
  path = path.toLowerCase().replace(/[ _]/g, '-').replace(/[^a-z0-9\/\-]/g, '');
  if (!_.str.startsWith(path, '/')) {
    path = '/' + path;
  }
  return path;
}
