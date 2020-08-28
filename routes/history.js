const Entry = require('../models/entry');
const router = require('express').Router();
// need to make sure entries get added to users array

var date = new Date();
var history = [];

router.get('/', (req, res, next) => {
    // var date = new Date();
    // var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    // Entry.find({date: {$ne: today}}).then((doc) => {
    //     res.send(doc);
    // }).catch((err) =>
    // {
    //     console.log("error: " + err);
    // })

    if (req.user)
    {
        for (i = req.user.entries.length-1 ; i >= 0; --i)
        {
            if (req.user.entries[i].date.getTime() !== new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
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