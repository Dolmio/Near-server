var express = require('express');
require("node-jsx").install();
var app = express();
var path = require('path');
var React = require('react/addons');
var ReactApp = React.createFactory(require('./site').ReactApp);

app.get('/', function (req, res) {
  var reactHtml = React.renderToString(ReactApp({}));
  res.render('index.ejs', {reactOutput: reactHtml});
});

app.use(express.static(path.join(__dirname, 'static')));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});
