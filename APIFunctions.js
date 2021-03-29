const fetch = require('node-fetch');
const simpleStorage = require('./simpleStorage');

const client_key = process.env.CLIENT_KEY;
const client_secret = process.env.CLIENT_SECRET;

async function getToken() {
    var token = "";
    var authString = Buffer.from(client_key + ':' + client_secret, 'utf-8').toString('base64');

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    var requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + authString,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlencoded,
        redirect: 'follow'
    };

    await fetch("https://api-test.sundsvall.se/token", requestOptions)
        .then(response => response.json())
        .then(result => {
            simpleStorage.setToken(result.access_token);
            simpleStorage.setTokenTime((result.expires_in - 10));
        })
        .catch(error => console.log('error', error));

    return token;
}

async function getPersonId(token, personNumber) {
    var returnResponse;

    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        redirect: 'follow'
    };

    await fetch(`https://api-test.sundsvall.se/citizen/sandbox/v1/person/${personNumber}/guid`, requestOptions)
        .then(response => returnResponse = response)
        .catch(error => console.log('error', error));

    return returnResponse;
}

async function getCategories(token) {
    var returnString = "error";

    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        redirect: 'follow'
    };

    await fetch("https://api-test.sundsvall.se/sandbox/incident/v01/api/validcategories", requestOptions)
        .then(response => response.json())
        .then(result => returnString = result)
        .catch(error => console.log('error', error));

    return returnString;
}

async function sendIncident(token, incidentObj) {
    var returnString = "error";

    var raw = JSON.stringify(incidentObj);
    var requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: raw,
        redirect: 'follow'
    };

    await fetch("https://api-test.sundsvall.se/sandbox/incident/v01/api/sendincident", requestOptions)
        .then(response => response.json())
        .then(result => returnString = result.incidentId)
        .catch(error => console.log('error', error));

    return returnString;
}

module.exports.getToken = getToken;
module.exports.getPersonId = getPersonId;
module.exports.getCategories = getCategories;
module.exports.sendIncident = sendIncident;