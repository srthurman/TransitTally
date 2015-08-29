var buffer = require('turf-buffer');
var within = require('turf-within');
var fc = require('turf-featurecollection');

var $ = require('jquery');
//var turf = require('turf');

var baseURI = window.location.href;

L.mapbox.accessToken = 'pk.eyJ1Ijoic3J0aHVybWFuIiwiYSI6IkVGXy1NMHcifQ.EouINDEZGzjGs0x0VMhHxg';

var map = L.mapbox.map('map','srthurman.n9l71i86')
    .setView([37.803291, -122.291137], 13);
    
var bartRoutes = L.mapbox.featureLayer()
    .loadURL('https://transitnearme-srthurman.c9.io/bart')
    .addTo(map);
    
//var bartStops = L.mapbox.featureLayer()
//    .loadURL('https://transitnearme-srthurman.c9.io/bartStops')
    //.addTo(map);
    
var marker = L.marker(new L.LatLng(37.803291, -122.291137), {
    icon: L.mapbox.marker.icon({
        "marker-color": "#FF00FF",
        "title": "You need coffee",
        "marker-symbol": "pitch",
        "marker-size": "large"
    }),
    draggable: true,
    zIndexOffset:999
}).addTo(map);

var bufferLayer = L.mapbox.featureLayer().addTo(map);

var bufferCntr = marker.getLatLng();
var pt = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [bufferCntr.lng, bufferCntr.lat]
  }
};
var transitBuffer = buffer(pt, 2, 'miles');

transitBuffer.properties = {
                "fill": "#00704A",
                "fill-opacity":0.05,
                "stroke": "#00704A",
                "stroke-width": 2,
                "stroke-opacity": 0.5
            };

bufferLayer.setGeoJSON(transitBuffer);
console.log(fc([transitBuffer]));

var filteredStops = L.mapbox.featureLayer().addTo(map);

$.get('https://transitnearme-srthurman.c9.io/bartStops', function(data) {
    console.log(data);
    var stops = within(data, fc([transitBuffer]));
    console.log(stops);
    filteredStops.setGeoJSON(stops);
});

var searchWithin = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-46.653,-23.543],
          [-46.634,-23.5346],
          [-46.613,-23.543],
          [-46.614,-23.559],
          [-46.631,-23.567],
          [-46.653,-23.560],
          [-46.653,-23.543]
        ]]
      }
    }
  ]
};
var points = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6318, -23.5523]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6246, -23.5325]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6062, -23.5513]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.663, -23.554]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.643, -23.557]
      }
    }
  ]
};

var test = within(points, searchWithin);
console.log(within);
//console.log(test);

//
            