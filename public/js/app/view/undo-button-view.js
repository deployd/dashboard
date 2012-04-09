define(["require", "exports", "module"], function(require, exports, module) {
var $button, $actionLabel, reverseFunc;

function init() {
  $button = $('#undo-btn');
  $actionLabel = $('.action-label', $button);

  hide();

  $button.click(function() {
    reverseFunc();
    $button.hide();
  });
}

function show(label, reverse) {
	$button.show();
	$actionLabel.text(label);
	reverseFunc = reverse;		
}

function hide() {
  $button.hide();
  reverseFunc = null;
  $actionLabel.text('');
}


module.exports = {
  init: init,
	show: show,
  hide: hide
};

init();
});
