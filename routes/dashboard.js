const router = require('express').Router();
var Entry = require('../models/entry');
const e = require('express');

date = new Date();

router.get('/',  (req, res, next) => {
    if (req.user)
    {
        var body = {entry: {food_names: [], food_codes: [], conversion_factors: [], nutrients: [], date: ""}, 
        reqs: req.user.requirements[0], name: req.user.firstname}
        for (i = req.user.entries.length-1 ; i >= 0; --i)
        {
            if (req.user.entries[i].date.getTime() === new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
            {
                body = {entry: req.user.entries[i], reqs: req.user.requirements[0], name:req.user.firstname};
            }
        }
        res.send(body)
    }
    else
    {
        res.redirect('/login');
    }
});

module.exports = router;