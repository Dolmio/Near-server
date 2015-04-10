var React = require('react/addons');
var Bacon = require('baconjs');
var ReactApp = React.createFactory(require('./site').ReactApp);
var mountNode = document.getElementById("react-mount-element");
var globalInitialState = initialState;
var citiesStream = require('./store').citiesStream;

var stateUpdates = Bacon.combineTemplate({
  cities: citiesStream

});

React.render(new ReactApp({stateStream: stateUpdates, initialState: globalInitialState}), mountNode);