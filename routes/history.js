const Entry = require('../models/entry');
const router = require('express').Router();
// need to make sure entries get added to users array

var date = new Date();
var history = [];

router.get('/', (req, res, next) => {
    if (req.user)
    {
        for (i = req.user.entries.length-1 ; i >= 0; --i)
        {
            if (req.user.entries[i].date.getTime() !== new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() 
            && req.user.entries.food_names.length > 0)
            {
                history.push(req.user.entries[i]);
            }
        }
        res.send(history);
    }
    else
    {
        res.redirect('/login');
    }
});

module.exports = router;