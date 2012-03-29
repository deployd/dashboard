var $span;
var currentText = "";
var active = false;

function init(preventReset) {
  $span = $('#save-status');
  if (preventReset) {
    $span.text(currentText);
    setActive(active);
  } else {
    set("");
    setActive(false);
  }
}

function saving() {
  set("Saving...");
  setActive(true);
}

function saved() {
  var now = new Date();

  set("Last saved " + now.toLocaleTimeString());
  setActive(false);
}

function set(text) {
  currentText = text;
  $span.text(text);
}

function setActive(nowActive) {
  if (nowActive) {
    $span.removeClass('inactive');
  } else {
    $span.addClass('inactive');
  }
  active = nowActive;
}

module.exports = {
  init: init,
  saving: saving,
  saved: saved
};

init();