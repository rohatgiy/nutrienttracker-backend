const router = require('express').Router();

var replaceAndUpdate = function (req, res, next)
{
    var entries = req.user.entries;
    var date = new Date();

    if (entries.length > 0 && entries[entries.length-1].date.getTime() === 
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
    {
        var originalEntry = entries[entries.length-1];
    }
    else
    {
       res.send('add an entry for today!')
    }
    
    next();
}

router.get('/', (req, res, next) => {
    /*
        1. get the entry with today's date from the db
        2. allow user to update entry
    */

    if (!req.user)
    {
        res.redirect('/login');
    }
    else
    {
        var entries = req.user.entries;
        var date = new Date();

        if (entries.length > 0 && entries[entries.length-1].date.getTime() === 
        new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
        {
            res.json(entries[entries.length-1]);
        }
        else
        {
            res.send('add an entry for today!')
        }
    }
});

router.post('/', (req, res, next) => {
    /*
        1. send the updates to the entry to the db, and update the entry in the user's profile
    */
    
   if (!req.user)
   {
       res.redirect('/login');
   }
   else
   {
       
   }
})

module.exports = router;