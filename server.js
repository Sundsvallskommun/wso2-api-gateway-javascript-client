const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const simpleStorage = require('./simpleStorage');

const port = 3002;

let startPage = require('./startPage');
let createErrand = require('./createErrand');
let displayErrandNr = require('./displayErrandNr');
let displayError = require('./displayError');

let app = express();

app.set('views', `${__dirname}/views`);

app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use (bodyParser.urlencoded( {extended : true} ) );

app.use ('/', startPage);
app.use ('/', createErrand);
app.use ('/', displayErrandNr);
app.use ('/', displayError);

simpleStorage.getToken().then(res => console.log("Got token"));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})