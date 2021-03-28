const router = require('express').Router();
const multer = require('multer');
const apiFunctions = require('./APIFunctions');
const simpleStorage = require('./simpleStorage');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

router.get('/createErrand', async (req, res) => {

    var token = await simpleStorage.getToken();
    var categories = await apiFunctions.getCategories(token);

    res.render ('createErrand', {
        pageTitle: "Nytt ärende",
        categories: categories
    });

});

router.post('/submitErrand', upload.single('incidentImage'), async (req, res) => {

    var personId = await simpleStorage.getValue();

    let incidentObj = {
        personId: personId,
        phoneNumber: req.body.inputPhone,
        email: req.body.inputEmail,
        contactMethod: req.body.contactMethodSelect,
        category: req.body.chosenCategory,
        description: req.body.descriptionTextarea,
        mapCoordinates: req.body.mapCoordinates,
        image: 'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64')
    }

    var token = await simpleStorage.getToken();
    var incidentId = await apiFunctions.sendIncident(token, incidentObj);

    simpleStorage.setValue(incidentId);
    res.redirect('/displayErrandNr');

});

module.exports = router;