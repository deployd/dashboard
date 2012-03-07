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
        defaultName: 'boolean'
      },
      Date: {
        defaultName: 'date'
      }
    });
  });

  app.get('/resources/:id', function(req, res){
    res.send({
      _id: req.param('id'),
      properties: {
        title: {
          type: 'string',
          typeLabel: 'String',
          required: true,
          order: 1
        },
        completed: {
          type: 'boolean',
          typeLabel: 'Boolean',
          order: 2
        }
      }
    });
  });

  app.put('/resources/:id', function(req, res) {
    res.send(req.body);
  });

  app.get('/todos', function(req, res) {
    res.send([{
      _id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
      title: 'Feed the dog',
      completed: true
    }, {
      _id: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
      title: 'Water the tree',
      completed: false
    }, {
      _id: '9f9039jg-39vj-29ck-saj3-9v09ds098vh3',
      title: 'Send email',
      completed: false
    }]);
  });

  app.post('/todos', function(req, res) {
    res.send(req.body);
  });

  app.put('/todos/:id', function(req, res) {
    res.send(req.body);
  });

  app.del('/todos/:id', function(req, res) {
    res.end();
  });
});