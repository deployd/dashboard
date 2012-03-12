var CollectionEventView = module.exports = Backbone.View.extend({

  template: _.template($('#events-template').html()),

  initialize: function() {
    
  },

  update: function(e) {
    this.model.set({
      onGet: this.onGetEditor.getSession().getValue(),
      onPost: this.onPostEditor.getSession().getValue(),
      onPut: this.onPutEditor.getSession().getValue(),
      onDelete: this.onDeleteEditor.getSession().getValue(),
    });
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));

    var JavaScriptMode = ace.require("ace/mode/javascript").Mode;
    var update = _.bind(this.update, this);

    var self = this;

    _.each(['onGet', 'onPost', 'onPut', 'onDelete'], function(eventName) {
      var editor = ace.edit(eventName);
      editor.getSession().setMode(new JavaScriptMode());
      editor.getSession().on('change', update);
      self[eventName + 'Editor'] = editor;
    });

    return this;
  }

});