var buffer = require('turf-buffer');
var within = require('turf-within');
var fc = require('turf-featurecollection');
var point = require('turf-point');

var $ = require('jquery');
//var turf = require('turf');

var baseURI = window.location.href;
var currentRadius = 0;

L.mapbox.accessToken = 'pk.eyJ1Ijoic3J0aHVybWFuIiwiYSI6IkVGXy1NMHcifQ.EouINDEZGzjGs0x0VMhHxg';

var map = L.mapbox.map('map','srthurman.n9l71i86')
    .setView([38.901078, -77.024361], 14);
    
var wmataRoutes = L.mapbox.featureLayer()
    .loadURL(baseURI+'wmataRoutes')
    //.addTo(map);
    
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


var metro;
var cabi;

var loadWmata = $.get(baseURI+'wmataStops', function(data) {
        metro = data;
    });
    
var loadCabi = $.get(baseURI+'cabi', function(data) {
        cabi = data;
    });
    
$.when(loadWmata, loadCabi).done(function() {
    //click-move functionality
    map.on('click',function(e){
        marker.setLatLng([e.latlng.lat, e.latlng.lng]);
        map.setView([e.latlng.lat, e.latlng.lng],14);
        updateTransitPoints();
    });
    
    // get position, get radius, draw buffer, find within, add to map
    function updateTransitPoints(){
        $('#tallies svg').remove();
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
        var bufferFC = fc([transitBuffer]);
        var stops = within(metro, bufferFC);
        
        var metroStops = [];
        for (var s=0,l=stops.features.length;s<l;s++) {
            var currStop = stops.features[s];
            
            var str = currStop['name'];
            var re = /metro station/i;
            var found = str.match(re);
            if (found) {
                currStop.properties["marker-color"] = "#666";
                currStop.properties["marker-size"] = "large";
                currStop.properties["marker-symbol"] = "m";
                metroStops.push(currStop);
            };
        }
        filteredStops.setGeoJSON(fc([metroStops]).features[0]);
        
        
        var cabiStations = [];
        
        for (var c=0, l=cabi.length;c<l;c++) {
            var station = cabi[c]
            cabiStations.push(point([station.long[0],station.lat[0]],
                {"name": station.name[0],
                "currBikes": station.nbBikes[0],
                "marker-color": "#E60000",
                "marker-size": "medium",
                "marker-symbol": "bicycle"
                }));
        }
        //var cabiFC = fc(cabiStations);
        var filteredCabi = L.mapbox.featureLayer().addTo(map);
        var cabiFC = fc(cabiStations);
        var cabis = within(cabiFC, bufferFC);
        filteredCabi.setGeoJSON(cabis);
        
        var cabiStationCount = cabis.features.length;
        var cabiBikeCount = 0;
        var cabiStationBikeCount = [];
        for (var b=0,l=cabis.features.length;b<l;b++) {
            var station = cabis.features[b];
            var bikeCount = Number(station.properties.currBikes);
            cabiBikeCount += bikeCount;
            cabiStationBikeCount.push(bikeCount);
        }
        
        var metroStopCount = metroStops.length;
        var busStopCount = stops.features.length - metroStopCount;
        
        $('#metroStopTally').html(metroStopCount);
        $('#busStopTally').html(busStopCount);
        $('#cabiStationTally').html(cabiStationCount);
        $('#cabiBikesTally').html(cabiBikeCount);
        
        ////D3 to create charts
        transitViz(cabiStationCount, cabiStationBikeCount, metroStopCount, busStopCount);
        
    }
    
    function transitViz(bikeStations, bikes, bus, metro) {
        var w = $("#tallies").width();
        var h = 100;
        var padding = 2;
        var dataset = bikes.sort(function(a, b){return a-b});
        
        var xScale = d3.scale.linear()
            .domain([0,dataset.length])
            .range([0,w]);
            
        var yScale = d3.scale.linear()
            .domain([
                d3.min(dataset),
                d3.max(dataset)
                ])
            .range([h,0]);
        
        var svg = d3.select("#tallies").append("svg")
            .attr("width", w)
            .attr("height",h);
            
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
                .attr("x", function(d, i) {
                    //return i * (w/dataset.length);
                    return xScale(i);
                })
                .attr("y", function(d) {
                    return yScale(d);
                })
                .attr("width", w/dataset.length - padding)
                .attr("height", function(d) {
                    return h - yScale(d);
                })
                .attr("fill", "blue");
    }
    
    ///Update radius
    function updateRadius() {
       var val = $('#radiusSelect').val();
       $("#radiusVal").val(val);
       
       currentRadius = Number(val)/20;
       updateTransitPoints();
    }
    
    $('#radiusSelect').change(function() {
       updateRadius();
    });

    marker.on('drag', function(){updateTransitPoints()});
    updateRadius();
    //updateTransitPoints();
});