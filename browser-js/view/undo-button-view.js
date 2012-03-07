var $button = $('#undo-btn');
var $actionLabel = $('.action-label', $button);

var reverseFunc = null;
$button.hide();

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

$button.click(function() {
	reverseFunc();
	$button.hide();
});

module.exports = {
	show: show,
  hide: hide
}