var React = require('react');
var Select = require('react-select');
var {Row , Col, TabbedArea, TabPane} = require('react-bootstrap');

var options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' }
];




var ExampleGoogleMap = React.createClass({
  getDefaultProps: function () {
    return {
      initialZoom: 8,
      mapCenterLat: 43.6425569,
      mapCenterLng: -79.4073126
    };
  },
  componentDidMount: function (rootNode) {
    var mapOptions = {
        center: this.mapCenterLatLng(),
        zoom: this.props.initialZoom
      },
      map = new google.maps.Map(this.getDOMNode(), mapOptions);
    var marker = new google.maps.Marker({position: this.mapCenterLatLng(), title: 'Hi', map: map});
    this.setState({map: map});
  },
  mapCenterLatLng: function () {
    var props = this.props;
    return new google.maps.LatLng(props.mapCenterLat, props.mapCenterLng);
  },
  render: function () {
    return (
      <div className='map-gic'></div>

    );
  }
});


var Navigation = React.createClass({
  render: function () {
    return (
      <div className="container">
        <Row>
          <Col>
            <h1>Near_ Admin</h1>
            <TabbedArea defaultActiveKey={2}>
              <TabPane eventKey={1} tab='Cities'><CitiesView /></TabPane>
              <TabPane eventKey={2} tab='Places'><PlacesView/></TabPane>
            </TabbedArea>
            <ExampleGoogleMap />
          </Col>
        </Row>
      </div>
    );
  }
});


var CitiesView = React.createClass({
  render: function() {
    return (<h1> Kaupungit</h1>);
  }
});

var PlacesView = React.createClass({
  render: function() {
    return (<h1>Paikat</h1>);
  }
});





React.render(
  <Navigation/> ,document.getElementById("map")
);