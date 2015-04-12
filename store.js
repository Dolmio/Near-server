var Bacon = require('baconjs');
Bacon.$ =  require("bacon.jquery");

var citiesStream = new Bacon.Bus();
var placesStream = new Bacon.Bus();

function upsertCity(type) {

  return function(city) {
    var cityUpsert = Bacon.$.ajax({ url: "/city", data: JSON.stringify(city), type:type, contentType: "application/json"});
    getCitiesAfter(cityUpsert);

  }
}

function getCitiesAfter(stream) {
  citiesStream.plug(stream.flatMap(function() {
    return Bacon.$.ajax({ url: "/cities"});
  }));
}

function getPlacesAfter(stream) {
  placesStream.plug(stream.flatMap(function() {
    return Bacon.$.ajax({ url: "/places"});
  }));
}


function upsertPlace(type) {
  return function(city) {
    var placeUpsert = Bacon.$.ajax({ url: "/place", data: JSON.stringify(city), type:type, contentType: "application/json"});
    getPlacesAfter(placeUpsert);

  }
}

module.exports = {

  createCity: upsertCity('post'),
  updateCity: upsertCity('put'),
  deleteCity: upsertCity('delete'),
  createPlace: upsertPlace('post'),
  updatePlace: upsertPlace('put'),
  deletePlace: upsertPlace('delete'),
  citiesStream : citiesStream,
  placesStream : placesStream
};