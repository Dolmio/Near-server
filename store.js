var Bacon = require('baconjs');
Bacon.$ =  require("bacon.jquery");

var citiesStream = new Bacon.Bus();

module.exports = {

  createCity: function(city) {
    var cityCreation = Bacon.$.ajax({ url: "/city", data: JSON.stringify(city), type:"post", contentType: "application/json"});

    citiesStream.plug(cityCreation.flatMap(function() {
      return Bacon.$.ajax({ url: "/cities"});
    }));
  },

  citiesStream : citiesStream
}