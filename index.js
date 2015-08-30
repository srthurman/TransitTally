var express = require('express');
var bartRoutes = require('./bartRoutes.json');
var bartStops = require('./bartStops.json');

var wmataMetro = require('./wmata_metro.json');
var wmataCirculator = require('./wmata_circulator.json');

var app = express();

app.configure(function() {
    
});

app.get('/bart', function(req, res) {
    res.json(bartRoutes);
});

app.get('/bartStops', function(req, res) {
    res.json(bartStops);
});

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

app.use(express.static('public'));

app.listen(process.env.PORT, process.env.IP);