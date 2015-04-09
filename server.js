var express = require('express');
require("node-jsx").install();
var app = express();
var path = require('path');
var React = require('react/addons');
var ReactApp = React.createFactory(require('./site').ReactApp);
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var util = require("util");
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'static')));
var pmongo = require('promised-mongo');
var db = pmongo('near');




app.get('/', function (req, res) {
  getCities().then(function(cities) {
    console.log(cities);
    var reactHtml = React.renderToString(ReactApp({cities: cities}));

    res.render('index.ejs', {reactOutput: reactHtml, state: JSON.stringify({cities: cities})});
  }).done();

});

function getCities() {
  return db.collection("cities").find().toArray();
}


app.get('/cities', function(req, res) {
  getCities().then(function(cities) {
    res.json(cities);

  }).done();
});

app.post('/city', function(req, res) {

  req.checkBody('name', 'Name cant be empty').notEmpty();
  req.checkBody('latitude', 'latitude must be number').notEmpty().isFloat();
  req.checkBody('longitude', 'longitude must be number').notEmpty().isFloat();

  var validationErrors = req.validationErrors();
  if(validationErrors) {
    res.send('There have been validation errors: ' + util.inspect(validationErrors), 400);
  }
  else {
    db.collection("cities").save(req.body).then(function() {
      res.sendStatus(200);
    }).done();

  }
});





var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});
