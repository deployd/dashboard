var dpd = require('deployd');

// Start testing server
dpd.use('http://localhost:2403').listen(function () {
  dpd.use('/keys').post(require('deployd/lib/key').keygen(), function (err, k) {
    if (err) { return console.log(err); }
    process.send(k);
  })
});
