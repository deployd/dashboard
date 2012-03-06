var undoBtn = require('./undo-button-view');

var PropertyView = module.exports = Backbone.View.extend({
  tagName: 'li',
  className: 'component-item',

  template: _.template($('#property-template').html()),

  events: {
    'click input[name="name"]': 'focusInput',
    'click .header': 'toggleActive',
    'click .delete-btn': 'delete',
    'change input[name="name"]': 'updateName',
    'keydown input[name="name"]': 'onNameKeydown',
    'change input[name="required"]': 'updateRequired'
  },

  initialize: function() {
    this.parentView = this.options.parentView;

    this.model.on('change', this.render, this);
  },

  render: function() {
    $(this.el).html(this.template({
      propertyModel: this.model,
      property: this.model.toJSON()
    })).attr('id', this.model.cid);

    if (this.model.hasChanged('c_active') && this.model.get('c_active')) {
      this.focusInput();
    }
  },

  focusInput: function() {
    this.$('input[name="name"]').focus();

    return false;
  },

  toggleActive: function() {
    this.model.set({c_active: !this.model.get('c_active')});  

    return false;
  },

  updateName: function() {
    this.model.set({name: this.$('input[name="name"]').val()});
  },

  updateRequired: function() {
    this.model.set({required: this.$('input[name="required"]').is(':checked')});
  },

  delete: function() {
    var self = this;
    var collection = self.parentView.collection; 

    collection.remove(self.model);

    undoBtn.show('Delete ' + self.model.get('name'), function() {
      collection.add(self.model, {at: self.model.get('order') - 1});
    });

    return false;
  },

  onNameKeydown: function(e) {
    if (e.which == 13) {
      this.updateName();
      this.model.set({c_active: false});
      return false;
    }

    if (e.which == 27) {
      this.model.set({c_active: false});
      return false;
    }
  },

  destroy: function() {
    this.model.off('change', this.render);
  }
  
});