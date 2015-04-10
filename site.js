var React = require('react');
var R = require("ramda");
var Select = require('react-select');
var RB = require('react-bootstrap');
var Row = RB.Row;
var Col = RB.Col;
var TabbedArea = RB.TabbedArea;
var TabPane = RB.TabPane;
var Table = RB.Table;
var Input = RB.Input;
var Store = require('./store');

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
  componentDidMount: function() {
    var component = this;
    this.props.stateStream.onValue(function(state){
        component.setState(state);
      }
    );
  },

  getInitialState: function() {
    return this.props.initialState;
  },

  render: function () {
    return (
      <div className="container">
        <Row>
          <Col>
            <h1>Near_ Admin</h1>
            <TabbedArea defaultActiveKey={2}>
              <TabPane eventKey={1} tab='Cities'><CitiesView cities={this.state.cities} /></TabPane>
              <TabPane eventKey={2} tab='Places'><PlacesView/></TabPane>
            </TabbedArea>

          </Col>
        </Row>
      </div>
    );
  }
});


var CitiesView = React.createClass({

  getInitialState: function() {
    return {};
  },

  addCityClickHandler: function() {
    this.setState(R.merge(this.state, {showCitiesForm: true}));
  },

  render: function() {
    var cities = this.props.cities;
    return (<div>
    {citiesTable(cities)}
     <div><button onClick={this.addCityClickHandler}className="btn btn-success"><span className="glyphicon glyphicon-plus"></span></button></div>
    {this.state.showCitiesForm ? React.createElement(CitiesForm) :  ""}
      <ExampleGoogleMap markers={cities}/>
    </div>
    )
    ;
  }
});


var CitiesForm = React.createClass({

  handleSubmit: function(e) {
    Store.createCity(this.getFormData());
    e.preventDefault();
  },

  getFormData: function() {
    return {name: this.refs.name.getInputDOMNode().value,
            latitude: this.refs.latitude.getInputDOMNode().value,
            longitude: this.refs.longitude.getInputDOMNode().value
    }
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Input type='text' label='Name' placeholder='Enter the name of the city' ref="name"/>
        <Input type='text' label='Latitude' placeholder='Enter the latitude of the city' ref="latitude"/>
        <Input type='text' label='Longitude' placeholder='Enter the longitude of the city' ref="longitude"/>
        <Input type='submit' value='Save' />
      </form>
    )
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