var undo = require('./undo-button-view');

var template = _.template($('#resource-template').html());

var ResourceView = module.exports = Backbone.View.extend({
  tagName: 'li',
  className: 'component-item',
  
  events: {
    'click .delete-btn': 'onDelete',
    'click .edit-btn': 'onActivate',
    'click .cancel-btn': 'onDeactivate',
    'click .save-btn': 'onSave',
    'blur input[name="path"]': 'onDeactivate',
    'click input[name="path"]': 'onFocus',
    'keypress input[name="path"]': 'onKeypress'
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

  onDelete: function() {
    var self = this;
    if (self.model.isNew()) {
      self.model.destroy();
    } else {
      if (confirm('Do you wish to delete this resource? All associated data and configuration will be permanently removed.')) {
        self.model.destroy({wait: true});
      }
    }
  },

  onActivate: function() {
    this.model.set({c_active: true});
    this.$('input[name="path"]').focus();
  },

  onDeactivate: function(e) {
    this.model.set({c_active: false});  
  },

  onSave: function() {
    this.model.save({path: this.$('input[name="path"]').val()});
    this.onDeactivate();
  },

  onFocus: function(e) {
    $(e.currentTarget).focus();
  },

  onChangePath: function(e) {
    this.model.save({path: $(e.currentTarget).val()});
  },

  onKeypress: function(e) {
    var val = $(e.currentTarget).val();

    if (!_.str.startsWith(val, '/')) {
      val = '/' + val;
      $(e.currentTarget).val(val);
    }

    if (e.keyCode == 13) {
      this.onSave();
    }

    
  },

  destroy: function() {
    this.model.off('change:c_active', this.render);
    this.model.off('change:_id', this.render);
    this.model.off('change:path', this.render);
  }
});
