const router = require('express').Router();
var Entry = require('../models/entry');
// need to make sure entries get added to user's array

date = new Date();

router.get('/',  (req, res, next) => {
    Entry.find({ date: new Date(date.getFullYear(), date.getMonth(), date.getDate())}).then((doc) => {
        res.send(doc);
    });
});

module.exports = router;