define(["require", "exports", "module"], function(require, exports, module) {
module.exports = function(message, x, y, length) {

  length = length || 3000;

  var $host = $('<div>')
    .css('position', 'absolute')
    .css('z-index', 1000)
    .css('top', y)
    .css('left', x)
    .tooltip({
      title: message,
      trigger: 'manual'
    })
  ;

  $host.appendTo('body').tooltip('show');

  setTimeout(function() {
    $host.tooltip('hide').remove();
  }, length);

};
});
