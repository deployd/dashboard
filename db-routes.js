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
    res.send({
      Collection: {
        defaultPath: '/collection'
      },
      UserCollection: {
        label: 'Users',
        defaultPath: '/users'
      }
    });
  });

  app.get('/resources', function(req, res) {
    // res.send([
    //   {
    //     _id: 0,
    //     path: '/todos',
    //     typeId: 'Collection',
    //     typeName: 'Collection',
    //     order: 1
    //   }, {
    //     _id: 1,
    //     path: '/users',
    //     typeId: 'UserCollection',
    //     typeName: 'User Collection',
    //     order: 2
    //   }
    // ]);
    res.send([]);
  });

  app.del('/resources/:id', function(req, res) {
    console.log("Deleting ", req.url);
    res.end();
  });

  app.put('/resources/:id', function(req, res) {
    console.log("Updating", req.url, req.body);
    res.send(req.body);
  });

  app.post('/resources', function(req, res) {
    var content = req.body;
    content._id = Math.round(Math.random() * 100);
    console.log("Creating resource", content);
    res.send(content);
  });


  app.get('/plugins/collection/types', function(req, res) {
    res.send({
      String: {
        defaultName: 'string'
      },
      Number: {
        defaultName: 'number'
      },
      Boolean: {
        deaultName: 'boolean'
      },
      Date: {
        defaultName: 'date'
      }
    });
  });

  app.get('/resources/:id/settings', function(req, res){
    res.send({
      properties: {
        title: {
          type: 'string',
          required: true,
          order: 1
        },
        completed: {
          type: 'boolean',
          order: 2
        }
      }
    });
  });
});