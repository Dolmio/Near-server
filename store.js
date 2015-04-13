var Bacon = require('baconjs');
Bacon.$ =  require("bacon.jquery");

var citiesStream = new Bacon.Bus();
var placesStream = new Bacon.Bus();

function upsertCity(type) {
  return upsertEntity(type, "/city", getCitiesAfter);
}

function getCitiesAfter(stream) {
  getEntityAfter(stream, citiesStream, "/cities");
}

function getEntityAfter(stream, bus, url) {
  bus.plug(stream.flatMap(function() {
    return Bacon.$.ajax({ url: url});
  }));
}

function upsertEntity(type, url, afterFn) {
  return function(entity) {
    var entityUpsert = Bacon.$.ajax({ url: url, data: JSON.stringify(entity), type:type, contentType: "application/json"});
    afterFn(entityUpsert);

  }
}

function getPlacesAfter(stream) {
  getEntityAfter(stream, placesStream, "/places");
}


function upsertPlace(type) {
  return upsertEntity(type, "/place", getPlacesAfter);
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