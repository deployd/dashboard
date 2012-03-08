
/**
 * Module dependencies.
 */

var express = require('express');
var browserify = require('browserify');
var path = require('path');
var fs = require('fs');
// var bootware = require('bootware');


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  // app.use(function(req,res,next) {
  //   res.header('Access-Control-Allow-Origin', '"*"');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type');
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   next();
  // })
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(browserify({entry: path.resolve('./browser-js/entry.js'), debug: true, watch: true}));
  app.use(express.static(__dirname + '/public'));
  app.use('/bootstrap', express.static(__dirname + '/bootstrap'));

  app.set('view options', { layout: false });


  require('./db-routes');
  app.use(app.router);

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
  // res.redirect('/dashboard');
  res.render('index');
});

app.get('/dashboard*', function(req, res){
  res.render('index', {
    // title: 'My App Dashboard',
    // appName: 'My App',
    // appUrl: 'https://myapp.deploydapp.com'
  });
});

// app.get('/dashboard/*', function(req, res) {
//   var resource = '/' + req.params[0];
//   res.render('model-editor', {
//     title: resource + ' - My App Dashboard',
//     appName: 'My App',
//     resourceName: resource,
//     resourceType: 'Collection'
//   });
// });



app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

