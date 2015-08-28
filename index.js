var express = require('express');
var bart = require('./bart.json');

var app = express();

app.configure(function() {
    
});

app.get('/bart', function(req, res) {
    res.json(bart);
});

app.use(express.static('public'));

app.listen(process.env.PORT, process.env.IP);