const router = require('express').Router();
var User = require('../models/user');
const { db } = require('../models/user');

router.get('/', (req, res, next) => {
    res.send('create an account here');
});

router.post('/', (req, res, next) => {

    var user = new User({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        entries: []
    });
    user.save();

    res.json(req.body);
});

module.exports = router;
