var buffer = require('turf-buffer');
//var turf = require('turf');

var baseURI = window.location.href;

L.mapbox.accessToken = 'pk.eyJ1Ijoic3J0aHVybWFuIiwiYSI6IkVGXy1NMHcifQ.EouINDEZGzjGs0x0VMhHxg';

var map = L.mapbox.map('map','srthurman.n9l71i86')
    .setView([37.803291, -122.291137], 13);
    
var bartRoutes = L.mapbox.featureLayer()
    .loadURL('https://transitnearme-srthurman.c9.io/bart')
    .addTo(map);
    
var bartStop = L.mapbox.featureLayer()
    .loadURL('https://transitnearme-srthurman.c9.io/bartStops')
    .addTo(map);
    
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
var transitBuffer = buffer(pt, 1, 'miles');

transitBuffer.properties = {
                "fill": "#00704A",
                "fill-opacity":0.05,
                "stroke": "#00704A",
                "stroke-width": 2,
                "stroke-opacity": 0.5
            };
console.log(marker.getLatLng());
bufferLayer.setGeoJSON(transitBuffer);
            