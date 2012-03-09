var fs = require('fs');
var path = require('path');

var util = function(name) {
  tag = '<script type="x-ejs-template" id="' + name + '-template" >\n';
  tag += fs.readFileSync(path.resolve(util.root, name + '.ejs'));
  tag += '\n</script>';
  return tag;
};
util.root = './views/templates';

module.exports = util;