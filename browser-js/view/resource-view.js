var undo = require('./undo-button-view');

var template = _.template($('#resource-template').html());

var ResourceView = module.exports = Backbone.View.extend({
  tagName: 'li',
  className: 'component-item',
  
  events: {
    'click .delete-btn': 'onDelete',
    'mouseenter': 'onActivate',
    'mouseleave': 'onDeactivate',
    'blur input[name="path"]': 'onDeactivate',
    'click input[name="path"]': 'onFocus',
    'change input[name="path"]': 'onChangePath',
    'keypress input[name="path"]': 'onSave'
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
  },

  onDeactivate: function(e) {
    //e.currentTarget

    if ($(e.currentTarget).is('input[name="path"]')) {
      this.model.set({c_active: false});
    } else {
      if (!this.$('input[name="path"]').is(':focus')) {
        this.model.set({c_active: false});
      }
    }
  },

  onFocus: function(e) {
    $(e.currentTarget).focus();
  },

  onChangePath: function(e) {
    this.model.save({path: $(e.currentTarget).val()});
  },

  onSave: function(e) {
    if (e.keyCode == 13) {
      this.model.set({c_active: false});
      this.model.save({path: $(e.currentTarget).val()});
    }
  },

  destroy: function() {
    this.model.off('change:c_active', this.render);
    this.model.off('change:_id', this.render);
    this.model.off('change:path', this.render);
  }
});
