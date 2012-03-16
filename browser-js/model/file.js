var File = module.exports = Backbone.Model.extend({ 
  
  url: function () {
    var info = this.get('info')
      , path = this.get('path')
    ;
    
    if(info) {
      return path + '/' + info.fileName;
    } else {
      return path;
    }
  },
  
  sync: function (method, model, options) {
    var self = this
      , args = arguments
    ;
      
    function next() {
      Backbone.sync.apply(model, args);
    }
    
    var info = model.get('info');
    
    if(method === 'create' && info) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        options.data = data.split(',')[1];
        next();
      };
      
      reader.readAsDataURL(info);
    } else {
      next();
    }
  }
  
});
