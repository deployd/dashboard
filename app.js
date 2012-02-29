
/**
 * Module dependencies.
 */

var express = require('express');
var browserify = require('browserify');
var path = require('path');
var fs = require('fs');
var bootware = require('bootware');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src:  path.resolve('./public'), enable: ['less'] }));
  app.use(browserify({entry: path.resolve('./browser-js/entry.js'), debug: true, watch: true}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(bootware({path: '../bootstrap'}));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.helpers({
  template: function(name) {
    tag = '<script type="x-ejs-template" id="' + name + '-template" >\n';
    tag += fs.readFileSync(path.resolve('./views/templates', name + '.ejs'));
    tag += '\n</script>';
    return tag;
  }
});

// Routes

app.get('/', function(req, res) {
  res.redirect('/dashboard');
});

app.get('/dashboard', function(req, res){
  res.render('index', {
    title: 'My App Dashboard',
    appName: 'My App'
  });
});

//Schema
app.get('/resourcetypes', function(req, res) {
  res.send(JSON.stringify([
    {
      id: 'dataModel',
      name: 'Data Model'
    }, {
      id: 'userModel',
      name: 'User Model'
    }
  ]));
});

app.get('/resources', function(req, res) {
  res.send(JSON.stringify([
    {
      path: '/todos',
      typeId: 'dataModel',
      typeName: 'Data Model',
      order: 1
    }, {
      path: '/users',
      typeId: 'userModel',
      typeName: 'User Model',
      order: 2
    }
  ]));
});

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
