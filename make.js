require('shelljs/make');

var browserify = require('browserify');
var ejs = require('ejs');

var templateHelper = require('./util/template-html');
templateHelper.root = '../views/templates';

target.all = function() {
  target.build();
};

target.build = function() {
  cd(__dirname);

  //Clean out build target
  rm('-rf', 'build/');

  mkdir('build');
  cd ('build');

  //Images
  mkdir('img');
  cp('-rf', '../public/img/', './');
  cp('-rf', '../bootstrap/img/', './');

  //Stylesheets
  mkdir('stylesheets');
  exec('lessc -x ../public/stylesheets/style.less stylesheets/style.css');

  //Javascripts
  mkdir('js');

  //Lib
  mkdir('js/lib', '-r');
  var lib = '../public/js/lib/';
  for (file in ls(lib)) {
    exec('uglifyjs ' + lib + file, {silent: true}).output.to('js/lib/' + file);
  }

  //Browserify
  browserify.bundle('../browser-js/entry.js').to('js/app.js');

  //HTML
  ejs.render(cat('../views/index.ejs'), {template: templateHelper, compile: true}).to('index.html');
};
