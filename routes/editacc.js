const router = require('express').Router();

router.get('/', (req, res, next) => {
    /*
        1. check if user is logged in
        2. fetch the user's info from db
        3. allow user to update their info
    */
    res.send('this is where you can update your user information');
})

router.post('/', (req, res, next) => {
    /*
        1. send the updated info to the db
    */
    res.json(req.body);
})

module.exports = router;