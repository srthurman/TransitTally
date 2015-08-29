var express = require('express');
var bartRoutes = require('./bartRoutes.json');
var bartStops = require('./bartStops.json');

var app = express();

app.configure(function() {
    
});

app.get('/bart', function(req, res) {
    res.json(bartRoutes);
});
app.get('/bartStops', function(req, res) {
    res.json(bartStops);
});

app.use(express.static('public'));

app.listen(process.env.PORT, process.env.IP);