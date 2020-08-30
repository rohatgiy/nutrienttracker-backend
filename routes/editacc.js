const router = require('express').Router();

router.get('/', (req, res, next) => {
    /*
        1. check if user is logged in
        2. fetch the user's info from db
        3. allow user to update their info
    */

    if (req.user)
    {
        res.send('this is where you can update your user information');
    }
    else
    {
        res.redirect('/login');
    }
});

router.post('/', (req, res, next) => {
     /*
        1. send the updated info to the db
    */
    if (req.user)
    {
        req.user.age = req.body.age;
        req.user.gender = req.body.gender;
        req.user.save();
        res.json(req.user);
    }
    else
    {
        res.redirect('/login');
    }
});

module.exports = router;