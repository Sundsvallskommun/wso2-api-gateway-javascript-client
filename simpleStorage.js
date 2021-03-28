const apiFunctions = require('./APIFunctions');

var globalValue = "";
var token = "";
var tokenTime = null;

async function getValue() {
    return globalValue;
}

function setValue(value) {
    globalValue = value;
}

async function getToken() {
    var currentTime = new Date();
    if (tokenTime != null && +currentTime < +tokenTime) {
        return token;
    }
    else {
        await apiFunctions.getToken();
        return token;
    }
}

function setToken(inputToken) {
    token = inputToken;
}

async function getTokenTime() {
    return tokenTime;
}

function setTokenTime(seconds) {
    var d = new Date();
    tokenTime = new Date(d.getTime() + (seconds * 1000));
}
  
module.exports.getValue = getValue;
module.exports.setValue = setValue;
module.exports.getToken = getToken;
module.exports.setToken = setToken;
module.exports.getTokenTime = getTokenTime;
module.exports.setTokenTime = setTokenTime;