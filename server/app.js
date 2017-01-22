// Modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('../strategies/userStrategy');
const scheduleReminder = require('../utils/schedule');

let app = express();

// Routing Modules
const organizerRouter = require('./routes/organizer');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const reminderRouter = require('./routes/reminder');
const contactRouter = require('./routes/contact');

// bodyParser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Serve static files
app.use(express.static('public'));

app.use(session({
    secret: 'my secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxage: 6000000,
        secure: false
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use('/organizer', organizerRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/reminder', reminderRouter);
app.use('/contact', contactRouter);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Listening on port', app.get('port'));
    scheduleReminder(4);
    scheduleReminder(6);
});

module.exports = app;
