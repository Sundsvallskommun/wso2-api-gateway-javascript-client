const router = require('express').Router();

router.get('/displayError', async (req, res) => {

    res.render ('error', {
        pageTitle: "Felaktigt personnummer"
    });
    
});

module.exports = router;