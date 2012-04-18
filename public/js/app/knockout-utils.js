define(function(require, exports, module) {

ko.bindingHandlers.cssNamed = {
  update: function(element, valueAccessor) {
    var value = ko.utils.unwrapObservable(valueAccessor());
    var lastClass = $(element).data('knockoutCssNamed');

    $(element).removeClass(lastClass || " ").addClass(value).data(value);
  }
}

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