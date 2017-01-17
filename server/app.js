// Modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('../strategies/userStrategy');
var app = express();

// Routing Modules
var organizerRouter = require('./routes/organizer');
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

// bodyParser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());

// Routes
app.use('/', indexRouter);
app.use('/organizer', organizerRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Listening on port', app.get('port'));
});

// Serve static files
app.use(express.static('public'));

module.exports = app;
