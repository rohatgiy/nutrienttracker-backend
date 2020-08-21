const router = require('express').Router();
var User = require('../models/user');
var Entry = require('../models/entry');

router.get('/users', (req, res, next) => {
    User.find({}).then((doc) => {
        res.send(doc);
    });
});

router.get('/entries', (req, res, next) => {
    Entry.find({}).then((doc) => {
        res.send(doc);
    });
});

router.get('/success', (req, res, next) => {
    res.send('sucess!');
});

router.get('/failure', (req, res, next) => {
    res.send('failure');
})

module.exports = router;