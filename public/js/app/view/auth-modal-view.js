define(function(require, exports, module) {

  var app = require('../app');

  var TemplateView = require('./template-view');

  var AuthModalView = module.exports = TemplateView.extend({
      el: '#authModal'

    , template: 'auth-modal-template'

    , initialize: function() {
      _.bindAll(this);

      TemplateView.prototype.initialize.apply(this, arguments);

      this.$el = $(this.el).modal({show: false});
      this.$el.on('click', '.save', this.saveAuthToken);
      this.$el.on('hidden', this.cancel);
    }

    , saveAuthToken: function() {
      
      this.hide();

      setTimeout(_.bind(function() {
        var authKey = this.$el.find('[name=key]').val();
        app.set({
          authKey: authKey
        }, {silent: true});
        app.trigger('change:authKey');
      }, this), 0);

      return false;
    }

    , show: function() {
      this.$el.find('[name=key]').val(app.get('authKey'));
      this.$el.modal('show');
    }

    , hide: function() {
      this._programHide = true; //Hack to make sure we don't reshow it
      setTimeout(_.bind(function() {
        this._programHide = false;
      }, this), 0);

      this.$el.modal('hide'); 
    }

    , update: function() {
      if (app.get('authKey')) {
        this.hide();
      } else {
        this.show();
      }

    }

    , showError: function() {
      this.$el.find('.key-error').show();
    }

    , hideError: function() {
      this.$el.find('.key-error').hide(); 
    }

    , cancel: function() {
      if (!this._programHide) {
        setTimeout(this.show, 0);  
      }
    }

  });

});