var express = require('express');

var bikeshare = require('node-capital-bikeshare');
var wmata = require('./src/js/utils/wmata');

var app = express();
app.set('views', './views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/wmataStops', function(req, res) {
    res.json(wmata.stops);
});

app.get('/wmataRoutes', function(req, res) {
    res.json(wmata.routes);
});
    
app.get('/cabi', function(req, res) {
    bikeshare.getAll(function(err, data) {
      res.json(data);
    });
})
app.use(express.static('dist'));

app.listen(process.env.PORT, process.env.IP);