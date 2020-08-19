const router = require('express').Router();

router.get('/:id', (req, res, next) => {
    /*
        1. get the entry with the corresponding id from db
        2. allow user to update entry
    */
    res.send(`This is where you can edit the entry with id ${req.params.id}`);

});

router.post('/:id', (req, res, next) => {
    /*
        1. send the updates to the entry to the db, and update the entry in the user's profile
    */
    res.json(req.body);
})

module.exports = router;