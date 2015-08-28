var baseURI = window.location.href;

L.mapbox.accessToken = 'pk.eyJ1Ijoic3J0aHVybWFuIiwiYSI6IkVGXy1NMHcifQ.EouINDEZGzjGs0x0VMhHxg';

var map = L.mapbox.map('map','srthurman.n9l71i86')
    .setView([37.803291, -122.291137], 15);
    
var featureLayer = L.mapbox.featureLayer()
    .loadURL('https://transitnearme-srthurman.c9.io/bart')
    .addTo(map);