'use strict';

var wmataMetro = require('../../../wmata_metro.json');
var wmataCirculator = require('../../../wmata_circulator.json');

var allWmataStops = wmataMetro['features'].concat(wmataCirculator['features'])
var wmataStops = {
        type: wmataMetro['type'],
        features:allWmataStops
};

var metroRoutes = [];
for (var i=0,l=wmataMetro['routes'].length;i<l;i++) {
    var currRoute = wmataMetro['routes'][i];
    var str = currRoute['properties'][3];
    var re = /metrorail/i;
    var found = str.match(re);
    if (found) {
        metroRoutes.push(currRoute);
    };
};  
var wmataRoutes = {
        type: wmataMetro['type'],
        features: metroRoutes
};

var wmata = {
    stops: wmataStops,
    routes: wmataRoutes
};

module.exports = wmata;