const Entry = require('../models/entry');
const router = require('express').Router();
// need to make sure entries get added to users array

router.get('/', (req, res, next) => {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    Entry.find({date: {$ne: today}}).then((doc) => {
        res.send(doc);
    }).catch((err) =>
    {
        console.log("error: " + err);
    })
});

module.exports = router;