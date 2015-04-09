var React = require('react/addons');
var ReactApp = React.createFactory(require('./site').ReactApp);
var mountNode = document.getElementById("react-mount-element");
var globalInitialState = initialState;
React.render(new ReactApp(globalInitialState), mountNode);