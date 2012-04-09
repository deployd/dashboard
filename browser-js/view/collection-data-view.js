var undoBtn = require('./undo-button-view');
var statusTooltip = require('./status-tooltip');

var app = require('../app');

var CollectionDataView = module.exports = Backbone.View.extend({

  el: '#current-data',

  template: _.template($('#model-table-template').html()),

  events: {
    'click .add-btn': 'addRow',
    'click .delete-btn': 'deleteRow',
    'click .edit-btn': 'editRow',
    'click .cancel-btn': 'cancelEditingRow',
    'dblclick td:not(.id)': 'editRow',
    'dblclick .id': 'copyId',
    'click .done-btn': 'commitRow',
    'keyup input': 'onFieldKeypress',
    'dblclick input': 'cancelEvent',
    'keyup #current-data-querystring': 'changeQuerystring'
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
    this.collection.on('change', this.render, this);

    $(this.el).on('focus', 'input', _.bind(function(e) {
      this._lastFocusedInput = e.currentTarget;
    }, this));

    this.$('#current-data-querystring').tooltip({animation: false, placement: 'left', trigger: 'focus'});

    this.collection.on('error', function(model, res, req) {
      var error = "Error!";
      try {
        error = JSON.parse(res.responseText).message;
      } catch (err) { }
      this.$('#current-data-querystring').attr('data-original-title', error).tooltip('fixTitle')
          .tooltip('show');
    }, this);

    this.collection.on('reset', function() {
      this.$('#current-data-querystring').attr('data-original-title', '').tooltip('fixTitle')
          .tooltip('hide');
    }, this);
    
    var collection = this.collection
      , self = this;
    
    // poll
    this._interval = setInterval(function () {      
      collection && !self.editing && collection.fetch();
    }, 1000);
  },

  save: function(callback) {
    this.editing = false;

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
    this.editing = true;
    var row = new Backbone.Model({c_active: true, c_save: true});
    this.collection.add(row);
    setTimeout(function() {
      this.$('tr[data-cid="' + row.cid + '"] input').first().focus();
    }, 0);
    return false;
  },

  deleteRow: function(e) {
    this.editing = false;
    var row = this._getRow(e);
    var index = this.collection.indexOf(row);
    row.destroy();
    row.unset('_id');

    undoBtn.show('Delete row', _.bind(function() {
      this.collection.create(row.toJSON());
    }, this));

    return false;
  },

  copyId: function(e) {
    var row = this._getRow(e);

    prompt('Copy the id to your clipboard:', row.id);

    return false;
  },

  editRow: function(e) {
    var row = this._getRow(e);
    row.set({c_active: true});

    this.editing = true;

    if ($(e.currentTarget).is('td')) {
      var prop = $(e.currentTarget).attr('data-prop');
      setTimeout(function() {
        this.$('tr[data-cid="' + row.cid + '"] td[data-prop="' + prop + '"] input').first().focus();
      }, 0);
    } else {
      setTimeout(function() {
        this.$('tr[data-cid="' + row.cid + '"] input').first().focus();
      }, 0);
    }

    

    return false;
  },

  commitRow: function(e) {
    var row = this._getRow(e);

    var changes = {};
    

    if (app.get('resourceTypeId') === 'UserCollection') {
      changes.email = $(e.currentTarget).parents('tr').find('input[name="email"]').val();
      var newPass = $(e.currentTarget).parents('tr').find('input[name="password"]').val();
      if (newPass) {
        changes.password = newPass;
      }
    }

    this.properties.each(function(prop) {
      var propName = prop.get('name');
      var type = prop.get('type');
      var $input = $(e.currentTarget).parents('tr').find('input[name="' + propName + '"]');
      var val = $input.val();

      if (type === 'number') {
        val = parseInt(val);
      } else if ( type === 'boolean' ) {
        val = $input.is(':checked');
      }

      changes[propName] = val;

    });

    this.saveRow(row, changes);

    return false;
  },

  cancelEditingRow: function(e) {
    var row = this._getRow(e);

    if (row.isNew()) {
      row.destroy();
    } else {
      row.fetch({success: function() {
        row.set({c_active: false});
        self.editing = false;
      }});  
    }    

    return false;
  },

  saveRow: function(row, changes) {
    var self = this;

    row.save(changes, {success: function() {
      self.editing = false;
      row.set({c_active: false});
    }, error: function(model, res, req) {
      var resJson;
      try {
        resJson = JSON.parse(res.responseText);
      } catch(err) {
        resJson = {};
      }
      if (resJson.errors) {
        row.set({c_errors: resJson.errors});
      } else {
        alert("An error occured while saving: " + res.responseText);
      }
    }});
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

  changeQuerystring: function() {
    this.collection.querystring = this.$('#current-data-querystring').val();
  },


  onFieldKeypress: function(e) {
    if (e.which === 13) { //enter
      this.commitRow(e);
    } else if ( e.which === 27) { //esc
      this.cancelEditingRow(e);
    }
  },

  render: function() {

    this.$('table').html(this.template({
      properties: this.properties.toJSON(),
      collectionModel: this.collection,
      resourceType: app.get('resourceTypeId')
    }));

    this.$('.error-tooltip').tooltip();      

  },

  _getRow: function(e) {
    var $target = $(e.currentTarget);
    if (!$target.is('tr')) {
      var $target = $target.parents('tr');
    }

    return this.collection.getByCid($target.attr('data-cid'));
  },

  close: function() {
    Backbone.View.prototype.close.call(this);
    clearInterval(this._interval);
  }

});