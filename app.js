'use strict';
require('rootpath')();
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    router = express.Router(),
    PORT = process.env.port || 3000;

app.use(bodyParser.json());
app.use(express.static('dev'));
//app.use('/src', express.static('src'));
//app.use('/docs', express.static('yuidoc'));

require('./routes')(router);
app.use('/', router);

app.listen(PORT);

console.log("Static file server running at\n => http://localhost:" + PORT + "/\nCTRL + C to shutdown");
//connect module uses debug module
//express module uses debug module