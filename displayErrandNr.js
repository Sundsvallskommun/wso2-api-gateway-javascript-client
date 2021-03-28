let router = require('express').Router();
let simpleStorage = require('./simpleStorage');

router.get('/displayErrandNr', async(req, res) => {

    let incidentID = await simpleStorage.getValue();

    res.render ('displayErrandNr', {
        pageTitle: "Ärende skickat, ditt ärende-ID är:",
        incidentID: incidentID
    });
    
});

module.exports = router;