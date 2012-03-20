var CollectionDataView = module.exports = Backbone.View.extend({

  el: '#current-data',

  template: _.template($('#model-table-template').html()),

  events: {
    'click .add-btn': 'addRow',
    'click .delete-btn': 'deleteRow',
    'click .edit-btn': 'editRow',
    'dblclick tr': 'editRow',
    'click .done-btn': 'commitRow',
    'change input': 'updateField',
    'keyup input': 'onFieldKeypress',
    'dblclick input': 'cancelEvent',
  },

  initialize: function() {
    this.properties = this.options.properties;
    this.collection = this.options.collection;

    
    this.properties.on('reset', this.render, this);
    this.properties.on('add', this.render, this);
    this.properties.on('remove', this.render, this);
    this.properties.on('change:name', this.render, this);

    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.render, this);
    this.collection.on('remove', this.render, this);
    this.collection.on('change:c_active', this.render, this);

    this.collection.on('change', function(model) {
      if (!model.get('c_save')) {
        var notClientChange = _.any(_.keys(model._changed), function(prop) {
          return !_.str.startsWith(prop, 'c_');
        });

        if (notClientChange) {
          model.set({'c_save': true});  
        }
      }
    }, this);
    this.properties.on('reset', function() {
      this.collection.fetch();
    }, this);

    $(this.el).on('focus', 'input', _.bind(function(e) {
      console.log('focus', e.currentTarget);
      this._lastFocusedInput = e.currentTarget;
    }, this));
  },

  save: function(callback) {

    this.collection.each(function(model) {
      var dfd = new jQuery.Deferred();
      if (model.get('c_delete')) {
        model.destroy({success: dfd.resolve, error: dfd.reject});
      } else if (model.get('c_save')) {
        model.save({}, {success: dfd.resolve, error: dfd.reject});
      }
    });

    jQuery.when.call(jQuery, deferreds).done(callback);
  },

  addRow: function() {
    var row = new Backbone.Model({c_active: true, c_save: true});
    this.collection.add(row);
    setTimeout(function() {
      this.$('tr[data-cid="' + row.cid + '"] input').first().focus();
    }, 0);
    return false;
  },

  deleteRow: function(e) {
    var row = this._getRow(e);
    if (row.isNew()) {
      this.collection.remove(row);
    } else {
      row.set({c_delete: true});
    }

    return false;
  },

  editRow: function(e) {
    var row = this._getRow(e);
    row.set({c_active: true});

    setTimeout(function() {
      this.$('tr[data-cid="' + row.cid + '"] input').first().focus();
    }, 0);

    return false;
  },

  commitRow: function(e) {
    var row = this._getRow(e);

    var changes = {
      c_active: false
    };

    $(e.currentTarget).parents('tr').find('input').each(function() {
      changes[$(this).attr('name')] = $(this).val();
    });

    row.save(changes);

    return false;
  },

  updateField: function(e) {
    var row = this._getRow(e);
    var name = $(e.currentTarget).attr('name');
    var val = $(e.currentTarget).val();
    var change = {};
    change[name] = val;
    row.set(change);

    return false;
  },

  cancelEvent: function() {
    return false;
  },

  onFieldKeypress: function(e) {
    if (e.which == '13' || e.which == '27') { //enter or esc
      this.commitRow(e);
    }
  },

  render: function() {

    $(this.el).html(this.template({
      properties: this.properties.toJSON(),
      collectionModel: this.collection
    }));

  },

  _getRow: function(e) {
    var $target = $(e.currentTarget);
    if (!$target.is('tr')) {
      var $target = $target.parents('tr');
    }

    return this.collection.getByCid($target.attr('data-cid'));
  }

});