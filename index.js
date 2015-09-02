var express = require('express');

var wmataMetro = require('./wmata_metro.json');
var wmataCirculator = require('./wmata_circulator.json');
var bikeshare = require('node-capital-bikeshare');

var request = require('request');

var app = express();

var allWmataStops = wmataMetro['features'].concat(wmataCirculator['features'])

var wmataStops = {
        type: wmataMetro['type'],
        features:allWmataStops
};
    
app.get('/wmataStops', function(req, res) {
    res.json(wmataStops);
});

var metroRoutes = [];

for (i=0,l=wmataMetro['routes'].length;i<l;i++) {
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
    
app.get('/wmataRoutes', function(req, res) {
    res.json(wmataRoutes);
});
    
app.get('/cabi', function(req, res) {
    bikeshare.getAll(function(err, data) {
      res.json(data);
    });
})
app.use(express.static('public'));

app.listen(process.env.PORT, process.env.IP);