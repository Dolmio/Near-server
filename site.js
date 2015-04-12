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
var Button = RB.Button;
var Store = require('./store');

var ExampleGoogleMap = React.createClass({

  getDefaultProps: function() {
    return {
      markers: [],
      center: {latitude : 50, longitude: 50},
      zoom: 10

    };
  },

  componentDidMount: function () {
    var mapOptions =  R.assoc('center', new google.maps.LatLng(this.props.center.latitude, this.props.center.longitude), this.props);
    var map = new google.maps.Map(this.getDOMNode(),mapOptions);
    this.props.markers.forEach(function(marker) {
      new google.maps.Marker({position: new google.maps.LatLng(marker.latitude, marker.longitude), title: marker.name, map: map});
    });
    this.setState({map: map});
  },

  componentWillReceiveProps: function(nextProps) {
    this.state.map.setCenter(new google.maps.LatLng(nextProps.center.latitude, nextProps.center.longitude));
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
        console.log("state updated")
        console.log(state)
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
              <TabPane eventKey={2} tab='Places'><PlacesView cities={this.state.cities} places={this.state.places}/></TabPane>
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
    this.setState(R.merge(this.state, {showForm: true, formData: {type: "add"}}));
  },

  citySelected: function(city) {
      this.setState(R.merge(this.state, {showForm: true, formData: R.merge(city, {type: "update"})}));
  },

  render: function() {
    var cities = this.props.cities;
    return (<div>
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
          <tr key={city._id} onClick={this.citySelected.bind(this, city)}>
            <td>{city.name}</td>
            <td>{city.latitude}</td>
            <td>{city.longitude}</td>
          </tr>)
      }.bind(this))}
        </tbody>
      </Table>
     <div><button onClick={this.addCityClickHandler}className="btn btn-success"><span className="glyphicon glyphicon-plus"></span></button></div>
    {this.state.showForm ? React.createElement(CitiesForm, this.state.formData) :  ""}
      <ExampleGoogleMap markers={cities} center={this.state.formData}/>
    </div>
    )
    ;
  }
});


var CitiesForm = React.createClass({

  handleSubmit: function(e) {
    if(this.props.type == "add") {
      Store.createCity(this.state);
    }
    else {
      Store.updateCity(this.state);
    }
    e.preventDefault();
  },

  getDefaultProps: function() {
    return {
      name: '',
      latitude: '',
      longitude:'',
      _id: ''
    };
  },

  getInitialState: function() {
    return this.props;
  },

  handleChange: function(e) {
    this.setState(R.merge(this.state, R.assoc(e.target.dataset.name, e.target.value, {})));
  },

  handleDelete: function() {
    Store.deleteCity(this.state);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Input type='hidden' value={this.props._id}/>
        <Input type='text' data-name="name" onChange={this.handleChange} value={this.state.name} label='Name' placeholder='Enter the name of the city'/>
        <Input type='text' data-name="latitude" onChange={this.handleChange} value={this.state.latitude} label='Latitude' placeholder='Enter the latitude of the city'/>
        <Input type='text' data-name="longitude" onChange={this.handleChange} value={this.state.longitude} label='Longitude' placeholder='Enter the longitude of the city'/>
        <Button type='submit' bsStyle="success">Save</Button>
        {this.state.type == "update" ? <Button bsStyle='danger' onClick={this.handleDelete}>Delete</Button> : ""}


      </form>
    )
  }

});

var PlacesView = React.createClass({

  getInitialState: function() {
    return this.props;
  },

  selectOptions: function(cities) {
    return cities.map(function(city) {
      return {value: city._id, label: city.name}
    });
  },

  selectChangeHandler: function(val) {
    this.setState(R.merge(this.state, {selectedCity: val}));
  },

  addPlaceClickHandler: function() {
    this.setState(R.merge(this.state, {showForm: true, formData: {type: "add"}}));
  },

  placeSelected: function(city) {
    this.setState(R.merge(this.state, {showForm: true, formData: R.merge(city, {type: "update"})}));
  },

  render: function() {
    console.log("jou")
    console.log(this.props.places);
    var places = this.props.places.filter(function(place) {
      if(this.state.selectedCity) {
        return place.city == this.state.selectedCity;
      }
      return true;
    }.bind(this));

    return (<div>

      <Select
        name="form-field-name"
        options={this.selectOptions(this.props.cities)}
        onChange={this.selectChangeHandler}
        value={this.state.selectedCity}
      />

      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Radius</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
      {places.map(function(place) {
        return (
          <tr key={place._id} onClick={this.placeSelected.bind(this, place)}>
            <td>{place.name}</td>
            <td>{place.description}</td>
            <td>{place.radius}</td>
            <td>{place.latitude}</td>
            <td>{place.longitude}</td>
          </tr>)
      }.bind(this))}
        </tbody>
      </Table>
      <div><button onClick={this.addPlaceClickHandler}className="btn btn-success"><span className="glyphicon glyphicon-plus"></span></button></div>
     {this.state.showForm ? React.createElement(PlaceForm, R.merge(this.state.formData, {city: this.state.selectedCity})) :  ""}


    </div>
    )
      ;
  }
});

var PlaceForm = React.createClass({

  handleSubmit: function(e) {
    if(this.props.type == "add") {
      Store.createPlace(this.state);
    }
    else {
      Store.updatePlace(this.state);
    }
    e.preventDefault();
  },

  getDefaultProps: function() {
    return {
      name: '',
      description: '',
      radius: '',
      city: '',
      latitude: '',
      longitude:'',
      _id: ''
    };
  },

  getInitialState: function() {
    return this.props;
  },

  handleChange: function(e) {
    this.setState(R.merge(this.state, R.assoc(e.target.dataset.name, e.target.value, {})));
  },

  handleDelete: function() {
    Store.deletePlace(this.state);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Input type='hidden' value={this.props._id}/>
        <Input type='hidden' value={this.props.city}/>
        <Input type='text' data-name="name" onChange={this.handleChange} value={this.state.name} label='Name' placeholder='Enter the name of the place'/>
        <Input type='text' data-name="description" onChange={this.handleChange} value={this.state.description} label='Description' placeholder='Enter short description of the place'/>
        <Input type='text' data-name="radius" onChange={this.handleChange} value={this.state.radius} label='Radius' placeholder='Enter the radius of the place'/>

        <Input type='text' data-name="latitude" onChange={this.handleChange} value={this.state.latitude} label='Latitude' placeholder='Enter the latitude of the place'/>
        <Input type='text' data-name="longitude" onChange={this.handleChange} value={this.state.longitude} label='Longitude' placeholder='Enter the longitude of the place'/>
        <Button type='submit' bsStyle="success" disabled={this.props.city == ""}>Save</Button>
        {this.state.type == "update" ? <Button bsStyle='danger' onClick={this.handleDelete}>Delete</Button> : ""}
      </form>
    )
  }

});


module.exports.ReactApp = ReactApp;