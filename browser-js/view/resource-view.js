var undo = require('./undo-button-view');

var template = _.template($('#resource-template').html());

var ResourceView = module.exports = Backbone.View.extend({
  tagName: 'li',
  className: 'component-item',
  
  events: {
    'click .delete-btn': 'delete',
    'click .edit-btn': 'gotoDetail',
    'dblclick .header': 'gotoDetail',
    'dblclick .path': 'activate',
    'click .rename-btn': 'activate',
    'click .cancel-btn': 'deactivate',
    'click .save-btn': 'save',
    'click input[name="path"]': 'onFocus',
    'keypress input[name="path"]': 'onKeypress',
    'keyup input[name="path"]': 'onKeyup'
  },
  
  initialize: function(){
    this.parentView = this.options.parentView;

    this.model.on('change:c_active', this.render, this);
    this.model.on('change:_id', this.render, this);
    this.model.on('change:path', this.render, this);

  },
  
  render: function(){
    var $el = $(this.el);
    $el.attr('id', this.model.cid).html(template({
      resource: this.model.toJSON()
    }));

    if (this.model.isNew()) {
      $el.addClass('unsaved');
    } else {
      $el.removeClass('unsaved');
    }
    return this;
  },

  gotoDetail: function() {
    location.href = 'http://www.google.com/?q=' + this.model.get('path');

    return false;
  },


  delete: function() {
    var self = this; 
    if (self.model.isNew()) {
      self.model.destroy();
    } else {
      if (confirm('Do you wish to delete this resource? All associated data and configuration will be permanently removed.')) {
        self.model.destroy({wait: true});
      }
    }

    return false;
  },

  activate: function() {

    this.model.set({c_active: true});
    this.$('input[name="path"]').focus();

    return false;
  },

  deactivate: function() {

    if (this.model.isNew()) {
      this.delete();
    } else {
      this.model.set({c_active: false});
    }

    return false;
    
  },

  save: function() {
    this.model.save({path: this.$('input[name="path"]').val()});
    this.model.set({c_active: false});

    return false;
  },

  onFocus: function(e) {
    $(e.currentTarget).focus();
  },

  onKeypress: function(e) {
    var val = $(e.currentTarget).val();

    if (!_.str.startsWith(val, '/')) {
      val = '/' + val;
      $(e.currentTarget).val(val);
    }
    
  },

  onKeyup: function(e) {
    if (e.keyCode == 13) {
      this.save();
    }

    if (e.keyCode == 27) {
      this.deactivate();
    }
  },

  destroy: function() {
    this.model.off('change:c_active', this.render);
    this.model.off('change:_id', this.render);
    this.model.off('change:path', this.render);
  }
});
