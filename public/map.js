var buffer = require('turf-buffer');
var within = require('turf-within');
var fc = require('turf-featurecollection');
var point = require('turf-point');

var $ = require('jquery');
//var turf = require('turf');

var baseURI = window.location.href;
var currentRadius = 0.5;

L.mapbox.accessToken = 'pk.eyJ1Ijoic3J0aHVybWFuIiwiYSI6IkVGXy1NMHcifQ.EouINDEZGzjGs0x0VMhHxg';

var map = L.mapbox.map('map','srthurman.n9l71i86')
    .setView([38.901078, -77.024361], 15);
    
var wmataRoutes = L.mapbox.featureLayer()
    .loadURL(baseURI+'wmataRoutes')
    .addTo(map);
    
var marker = L.marker(new L.LatLng(38.901078, -77.024361), {
    icon: L.mapbox.marker.icon({
        "marker-color": "#FF00FF",
        "title": "You need coffee",
        "marker-symbol": "pitch",
        "marker-size": "large"
    }),
    draggable: true,
    zIndexOffset:999
}).addTo(map);


$.get(baseURI+'wmataStops', function(data) {
    //click-move functionality
    map.on('click',function(e){
        marker.setLatLng([e.latlng.lat, e.latlng.lng]);
        map.setView([e.latlng.lat, e.latlng.lng],15);
        updateTransitPoints();
    });
    
    // get position, get radius, draw buffer, find within, calculate distances, find nearest, add to map
    function updateTransitPoints(){
        $('path').remove();
        $('.leaflet-marker-pane *').not(':first').remove();
        var position=marker.getLatLng();
        var pt=point([position.lng, position.lat]);

        //draw buffer
        var bufferLayer = L.mapbox.featureLayer().addTo(map);
        
        var transitBuffer = buffer(pt, currentRadius, 'miles');
        transitBuffer.properties = {
            "fill": "#00704A",
            "fill-opacity":0.05,
            "stroke": "#00704A",
            "stroke-width": 2,
            "stroke-opacity": 0.5
        };
        
        bufferLayer.setGeoJSON(transitBuffer);
        
        //load stops and filter based on buffer
        var filteredStops = L.mapbox.featureLayer().addTo(map);
        var stops = within(data, fc([transitBuffer]));
        console.log(stops);
        
        var metroStops = [];
        for (s=0,l=stops.features.length;s<l;s++) {
            var currStop = stops.features[s];
            var str = currStop['name'];
            var re = /metro station/i;
            var found = str.match(re);
            if (found) {
                metroStops.push(currStop);
            };
        }
        console.log(fc([metroStops]).features[0]);
        filteredStops.setGeoJSON(fc([metroStops]).features[0]);
        
        var metroStopCount = metroStops.length;
        var busStopCount = stops.features.length - metroStopCount;
        
        $('#metroStopTally').html(metroStopCount);
        $('#busStopTally').html(busStopCount);
    }
    marker.on('drag', function(){updateTransitPoints()});
    updateTransitPoints();
});