
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
    res.cookie('DPDAuthKey', JSON.stringify({
      "9836187791079283":"15826097736135125259357509203255203287424240261316","17097654496319592":"81223031086847193943354440852999736659348173998296","11505278293043375":"29466226045042276800982918823137928415199602022767","3946601003408432":"980852520326152459963827836327255053266563918442","6402611697558314":"671505375299602787981753470376137235387580003589","17829329543747008":"6311294413171709495155196636915227204978675581515","_id":"4f5a4b13987cf82d26000001"
    }));
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

