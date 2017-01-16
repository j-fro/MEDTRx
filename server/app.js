// Modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
let app = express();

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log('Listening on port', app.get('port'));
});
