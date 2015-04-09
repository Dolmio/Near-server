var React = require('react');
var R = require("ramda");
var Select = require('react-select');
var RB = require('react-bootstrap');
var Row = RB.Row;
var Col = RB.Col;
var TabbedArea = RB.TabbedArea;
var TabPane = RB.TabPane;
var Table = RB.Table;


var options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' }
];




var ExampleGoogleMap = React.createClass({

  componentDidMount: function (rootNode) {
    var mapOptions = {
        center: this.mapCenterLatLng(),
        zoom: this.props.initialZoom || 20
      },
      map = new google.maps.Map(this.getDOMNode(), mapOptions);
    this.props.markers.forEach(function(marker) {
      new google.maps.Marker({position: new google.maps.LatLng(marker.latitude, marker.longitude), title: marker.name, map: map});
    });
    this.setState({map: map});
  },
  mapCenterLatLng: function () {
    var defaultLatLng = {latitude : 50, longitude: 50};
    var latLng = R.isEmpty(this.props.markers) ? defaultLatLng : R.head(this.props.markers);
    return new google.maps.LatLng(latLng.latitude, latLng.longitude);
  },
  render: function () {
    return (
      <div className='map-gic'></div>

    );
  }
});


var ReactApp = React.createClass({
  render: function () {
    return (
      <div className="container">
        <Row>
          <Col>
            <h1>Near_ Admin</h1>
            <TabbedArea defaultActiveKey={2}>
              <TabPane eventKey={1} tab='Cities'><CitiesView cities={this.props.cities} /></TabPane>
              <TabPane eventKey={2} tab='Places'><PlacesView/></TabPane>
            </TabbedArea>

          </Col>
        </Row>
      </div>
    );
  }
});


var CitiesView = React.createClass({

  render: function() {
    var cities = this.props.cities;
    return (<div>
    {citiesTable(cities)}
      <ExampleGoogleMap markers={cities}/>
    </div>
    )
    ;
  }
});


function citiesTable(cities){
  return (
  <Table striped bordered condensed hover>
    <thead>
      <tr>
        <th>Name</th>
        <th>Latitude</th>
        <th>Longitude</th>
      </tr>
    </thead>
    <tbody>
      {cities.map(function(city) { 
      return (
      <tr key={city._id}>

        <td>{city.name}</td>
        <td>{city.latitude}</td>
        <td>{city.longitude}</td>
      </tr>)})}
    </tbody>
  </Table>
)};



var PlacesView = React.createClass({
  render: function() {
    return (<h1>Paikat</h1>);
  }
});

module.exports.ReactApp = ReactApp;