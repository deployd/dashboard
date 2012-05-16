require('shelljs/make');

var requirejs = require('requirejs');
var ejs = require('ejs');

var libs = require('./client-libs');
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

  var libFolder = '../public/js/lib/'
  var libsjs = '';
  libs.forEach(function(file) {
    libsjs += exec('uglifyjs ' + libFolder + file, {silent: true}).output + '\n;\n';
  });
  libsjs.to('js/lib.js');

  cp('../public/js/lib/require.js', 'js/require.js');

  //require.js
  var config = {
    baseUrl: '../public/js/app',
    name: 'entry',
    out: '../build/js/entry.js'
  };
  requirejs.optimize(config);

  //HTML
  ejs.render(cat('../views/index.ejs'), {template: templateHelper, compile: true}).to('index.html');
};
