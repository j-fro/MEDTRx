// Modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// Routing Modules
var organizer = require('./routes/organizer');

// bodyParser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/organizer', organizer);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Listening on port', app.get('port'));
});

// Serve static files
app.use(express.static('public'));

module.exports = app;
