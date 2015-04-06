var express = require('express');
var app = express();
var path = require('path');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/static/index.html');
});

app.use(express.static(path.join(__dirname, 'static')));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});
