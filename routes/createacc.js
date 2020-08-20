const router = require('express').Router();
var User = require('../models/user');
var userController = require('../controllers/userController');
const { db } = require('../models/user');

router.get('/', (req, res, next) => {
    res.send('create an account here');
});

router.post('/', userController.create_user_post);

module.exports = router;
