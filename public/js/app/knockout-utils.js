define(function(require, exports, module) {

var unwrap = ko.utils.unwrapObservable;

ko.bindingHandlers.cssNamed = {
  update: function(element, valueAccessor) {
    var value = ko.utils.unwrapObservable(valueAccessor());
    var lastClass = $(element).data('knockoutCssNamed');

    $(element).removeClass(lastClass || " ").addClass(value).data('knockoutCssNamed', value);
  }
};

ko.bindingHandlers.tooltip = {
  init: function(element, valueAccessor) {
    var value = ko.toJS(valueAccessor());
    $(element).tooltip(value);
  }
  , update: function(element, valueAccessor) {
    $(element).attr('data-original-title', unwrap(valueAccessor().title));
  }
}

ko.bindingHandlers.popover = {
  init: function(element, valueAccessor) {
    var value = ko.toJS(valueAccessor());
    $(element).popover(value);
  }
  , update: function(element, valueAccessor) {
    $(element).attr('data-original-title', unwrap(valueAccessor().title));
    $(element).attr('data-content', unwrap(valueAccessor().content));
  }
};

ko.extenders.variableName = function(target) {

  var result = ko.computed({
    read: target,
    write: function(newValue) {
      var current = target();
      newValue = newValue.replace(/[^A-Za-z0-9_]/g, '');

      if (current !== newValue) {
        target(newValue);
      }
    }
  });

  result(target());

  return result;

};

//Copied from http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
function objectEquals(x, y){
  var p;
  for(p in y) {
      if(typeof(x[p])=='undefined') {return false;}
  }

  for(p in y) {
      if (y[p]) {
          switch(typeof(y[p])) {
              case 'object':
                  if (!objectEquals(x[p], y[p])) { return false; } break;
              case 'function':
                  if (typeof(x[p])=='undefined' ||
                      (p != 'equals' && y[p].toString() != x[p].toString()))
                      return false;
                  break;
              default:
                  if (y[p] != x[p]) { return false; }
          }
      } else {
          if (x[p])
              return false;
      }
  }

  for(p in x) {
      if(typeof(y[p])=='undefined') {return false;}
  }

  return true;
}



module.exports = {
  objectEquals: objectEquals
}

})