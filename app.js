
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
  app.use(express.cookieParser());
  app.use(function(req,res,next) {
    res.cookie('DPDAppUrl', 'http://localhost:2403');
    res.cookie('DPDAuthKey', JSON.stringify({"8897668235003948":"37597095081582665241964802145957956479304400272667","2888323061633855":"36915109516121447579542178427800512372108642011881","726026913151145":"136925984872505070889013099949806949009765358641744","6210475461557508":"628068739781156243560097343288360217047231271863","2604671607259661":"721565626095980459498652676120411294810380786657","_id":"4f5e1c2685cbbc9309000001"}));
    next();
  })
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(browserify({entry: path.resolve('./browser-js/entry.js'), mount: '/js/app.js', debug: true, watch: true}));
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
  template: require('./util/template-html')
});

// Routes

app.get('/', function(req, res) {
  res.redirect('/index.html');
});

app.get('/index.html', function(req, res) {
  // res.redirect('/dashboard');
  res.render('index');
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

