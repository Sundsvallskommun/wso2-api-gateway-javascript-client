const router = require('express').Router();
const apiFunctions = require('./APIFunctions');
const simpleStorage = require('./simpleStorage');

router.get('/', async (req, res) => {

    res.render ('startPage', {
        pageTitle: "Personnummer"
    });

});

router.post('/submitPnr', async (req, res) => {

    var pnr = req.body.personalNumber;
    var token = await simpleStorage.getToken();
    var personIdResponse = await apiFunctions.getPersonId(token, pnr);
    
    if (personIdResponse.status == 200) {
        var personId = await personIdResponse.text();
        simpleStorage.setValue(personId);
        res.redirect('/createErrand');
    }
    else {
        res.redirect('/displayError');
    }
    
});

module.exports = router;