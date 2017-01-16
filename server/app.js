// Modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// bodyParser setup
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log('Listening on port', app.get('port'));
});

// Serve static files
app.use(express.static('public'));

module.exports = app;
