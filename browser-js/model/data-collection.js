var DataCollection = module.exports = Backbone.Collection.extend({
  url: function() {
    var url = this.path;
    if (this.querystring) {

      if (this.querystring.indexOf('{') == 0) {
        url += '?q=' + this.querystring
      } else {
        url += '?' + this.querystring
      }      
    }
    return url;
  }
});