var React = require('react/addons');
var ReactApp = React.createFactory(require('./site').ReactApp);
var mountNode = document.getElementById("react-mount-element");
React.render(new ReactApp({}), mountNode);