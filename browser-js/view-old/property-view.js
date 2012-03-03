var EventEmitter = require('events').EventEmitter;

var propertyTemplate = Handlebars.compile($('#property-template').html());


module.exports = function(data) {

  var events = new EventEmitter();

  data = data || {};

  var model = {
    type: "",
    name: "",
    required: false,
    active: false
  };
  _.extend(model, data);

  var $el = $(propertyTemplate(model));

  var headerMouseDownHack;

  $(".header", $el).bind("mousedown", function(e){
    headerMouseDownHack = { x:e.pageX, y:e.pageY };
    return true;
  });
  $(".header", $el).bind("mouseup", function(e){
   if(headerMouseDownHack.x == e.pageX &&
       headerMouseDownHack.y == e.pageY) {
    setActive(!model.active);
   }
   headerMouseDownHack = null;
   return true;
 });

  $('input[name="name"]', $el).click(function() { 
    return false;
  }).change(function() {
    setName($(this).val());
  }).keypress(function(e) {
    if (e.keyCode == 13) {
      setActive(false);
    }
  });;

  $('input[name="required"]', $el).change(function() {
    setRequired($(this).is(':checked'));
  });


  function setActive(active) {
    model.active = active;
    if(active) {
      $el.addClass('active');
      $('input[name="name"]', $el).show().focus();
      $('.name', $el).hide();
      $('.detail', $el).show();
    } else {
      $el.removeClass('active');
      $('input[name="name"]', $el).hide();
      $('.name', $el).show();
      $('.detail', $el).hide();
    }
  };

  function setName(name) {
    model.name = name;
    $('input[name="name"]', $el).val(name);
    $('.name', $el).text(name);
    events.emit('changeName', model);
  }

  function setRequired(required) {
    model.required = name;
    if (required) {
      $('.required', $el).show(); 
    } else {
      $('.required', $el).hide(); 
    }
  }
  
  return {
    $el: $el,
    events: events,
    model: model,
    setActive: setActive
  }
};