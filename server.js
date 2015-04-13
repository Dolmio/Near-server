var express = require('express');
require("node-jsx").install();
var app = express();
var path = require('path');
var React = require('react/addons');
var ReactApp = React.createFactory(require('./site').ReactApp);
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var util = require("util");
var Promise = require('bluebird');
app.use(bodyParser.json());
app.use(expressValidator({
  customValidators: {
    isObjectId: isValidObjectId
  }
}));
app.use(express.static(path.join(__dirname, 'static')));
var pmongo = require('promised-mongo');
var db = pmongo(process.env.MONGOLAB_URI || 'near');




app.get('/', function (req, res) {
  Promise.all([getCities(), getPlaces()]).then(function(results) {
    var cities = results[0];
    var places = results[1];
    var state =  {cities: cities, places: places};
    var reactHtml = React.renderToString(ReactApp({initialState: state}));

    res.render('index.ejs', {reactOutput: reactHtml, state: JSON.stringify(state)});
  }).done()

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

  addCommonCityValidations(req);
  var validationErrors = req.validationErrors();
  if(validationErrors) {
    res.send('There have been validation errors: ' + util.inspect(validationErrors), 400);
  }
  else {
    db.collection("cities").save({
      name: req.body.name,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    })
      .then(function() {
        console.log("Inserted: " + util.inspect(req.body));
        res.sendStatus(200);
    }).done();

  }
});

function addCommonCityValidations(req) {
  req.checkBody('name', 'Name cant be empty').notEmpty();
  req.checkBody('latitude', 'latitude must be number').notEmpty().isFloat();
  req.checkBody('longitude', 'longitude must be number').notEmpty().isFloat();
}

app.put('/city', function(req,res) {

  addCommonCityValidations(req);
  req.checkBody('_id', '_id has to be objectId').isObjectId();

  var validationErrors = req.validationErrors();
  if(validationErrors) {
    res.send('There have been validation errors: ' + util.inspect(validationErrors), 400);
  }
  else {
    db.collection('cities').findAndModify({
      query: { _id: pmongo.ObjectId(req.body._id) },
      update: { $set: {
        name: req.body.name,
        latitude: req.body.latitude,
        longitude: req.body.longitude
      }},
      new: true
    })
      .then(function(doc) {
        console.log("Updated: " + util.inspect(doc));
        res.sendStatus(200);
      }).done();
  }
});

app.delete('/city', function(req,res) {
  removeFromCollection(req, res, "cities");
});


function addCommonPlaceValidations(req) {
  req.checkBody('name', 'Name cant be empty').notEmpty();
  req.checkBody('description', 'Description cant be empty').notEmpty();
  req.checkBody('city', 'city must be objectId').notEmpty().isObjectId();
  req.checkBody('radius', 'radius must be number').notEmpty().isFloat();
  req.checkBody('latitude', 'latitude must be number').notEmpty().isFloat();
  req.checkBody('longitude', 'longitude must be number').notEmpty().isFloat();
}

app.post('/place', function(req, res) {

  addCommonPlaceValidations(req);
  var validationErrors = req.validationErrors();
  if(validationErrors) {
    res.send('There have been validation errors: ' + util.inspect(validationErrors), 400);
  }
  else {
    var cityId = pmongo.ObjectId(req.body.city);

    db.collection('cities').findOne({_id: cityId}).then(function(res) {
      if(res == null) {
        res.send('City id should exists: ', 400);
      }
      else {
        return savePlace();
      }

    }).done();

    function savePlace() {
      return db.collection("places").save({
        name: req.body.name,
        description: req.body.description,
        city: cityId,
        radius: req.body.radius,
        latitude: req.body.latitude,
        longitude: req.body.longitude
      })
        .then(function() {
          console.log("Inserted: " + util.inspect(req.body));
          res.sendStatus(200);
        });
    }


  }
});

function getPlaces() {
  return db.collection("places").find().toArray();
}

app.get('/places', function(req, res) {
  getPlaces().then(function(cities) {
    res.json(cities);

  }).done();
});

app.delete('/place', function(req,res) {
  removeFromCollection(req, res, "places");
});

app.put('/place', function(req,res) {

  addCommonPlaceValidations(req);
  req.checkBody('_id', '_id has to be objectId').isObjectId();

  var validationErrors = req.validationErrors();
  if(validationErrors) {
    res.send('There have been validation errors: ' + util.inspect(validationErrors), 400);
  }
  else {
    db.collection('places').findAndModify({
      query: { _id: pmongo.ObjectId(req.body._id) },
      update: { $set: {
        name: req.body.name,
        description: req.body.description,
        city: pmongo.ObjectId(req.body.city),
        radius: req.body.radius,
        latitude: req.body.latitude,
        longitude: req.body.longitude
      }},
      new: true
    })
      .then(function(doc) {
        console.log("Updated: " + util.inspect(doc));
        res.sendStatus(200);
      }).done();
  }
});

function removeFromCollection(req, res, collection) {
  req.checkBody('_id', '_id has to be objectId').isObjectId();
  var validationErrors = req.validationErrors();
  if(validationErrors) {
    res.send('There have been validation errors: ' + util.inspect(validationErrors), 400);
  }
  else {
    db.collection(collection).remove({_id: pmongo.ObjectId(req.body._id)})
      .then(function() {
        console.log("Removed: " + util.inspect(req.body));
        res.sendStatus(200);
      }).done();
  }
}

function isValidObjectId(id) {
  try{
    pmongo.ObjectId(id);
    return true;
  }catch(err) {
    return false;
  }
}

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});
