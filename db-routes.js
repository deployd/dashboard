var app = require('./app');
require('express-namespace');

app.use('/db', function(req, res, next) {
  if (req.method == "GET") {
    next();
  } else {
    setTimeout(next, 500);  
  }
});

app.namespace('/db', function() {

  app.get('/resourcetypes', function(req, res) {
    res.send([
      {
        _id: 0,
        name: 'Data Model',
        defaultPath: '/dataModel',
      }, {
        _id: 1,
        name: 'User Model',
        defaultPath: '/users',
      }
    ]);
  });

  app.get('/resources', function(req, res) {
    res.send(JSON.stringify([
      {
        _id: 0,
        path: '/todos',
        typeId: 0,
        typeName: 'Data Model',
        order: 1
      }, {
        _id: 1,
        path: '/users',
        typeId: 1,
        typeName: 'User Model',
        order: 2
      }
    ]));
  });

  app.del('/resources/*', function(req, res) {
    console.log("Deleting " + req.params[0]);
    res.end();
  });

  app.put('/resources/:id', function(req, res) {
    res.send(req.body);
  });

  app.post('/resources', function(req, res) {
    var content = req.body;
    content._id = Math.round(Math.random() * 100);
    res.send(content);
  });
});