const router = require('express').Router();
var Entry = require('../models/entry');
const e = require('express');

date = new Date();

router.get('/',  (req, res, next) => {
    if (req.user)
    {
        for (i = req.user.entries.length-1 ; i >= 0; --i)
        {
            if (req.user.entries[i].date.getTime() === new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
            {
                res.send(req.user.entries[i]);
            }
        }
    }
    else
    {
        res.redirect('/login');
    }
    
});

module.exports = router;