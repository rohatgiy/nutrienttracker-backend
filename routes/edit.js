const Entry = require('../models/entry');
const fs = require('fs');
const router = require('express').Router();

var setup = function (req, res, next)
{
    res.locals.delete_index = req.body.delete_index;

    var entries = req.user.entries;
    var date = new Date();

    if (entries.length > 0 && entries[entries.length-1].date.getTime() === 
       new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
    {
        res.locals.temp_food_code = entries[entries.length-1].food_codes[res.locals.delete_index];
    }
    next();
}

var getBaseNutrients = function (req, res, next)
{
    fs.readFile('foods_formatted.json', 'utf8', (err, data) => {
        if (err)
        {
            return console.log(err);
        }
        obj = JSON.parse(data);
        var check = res.locals.temp_food_code;
        for (i = 0; i < obj.length; ++i)
        {
            if (obj[i].food_code === check)
            {
                nutrient_amounts = [];
                for (j = 0; j < obj[i].nutrients.length; ++j)
                {
                    nutrient_amounts.push(obj[i].nutrients[j].nutrient_amount);
                }
            }
        }
        res.locals.baseNutrients = nutrient_amounts;
        next();
    })
}

router.get('/', (req, res, next) => {
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

router.post('/', setup, getBaseNutrients, (req, res, next) => {
   if (!req.user)
   {
       res.redirect('/login');
   }
   else
   {
       var delete_index = res.locals.delete_index;
       console.log('the delete index is: ' + delete_index)
       var entries = req.user.entries;
       var date = new Date();
   
       if (entries.length > 0 && entries[entries.length-1].date.getTime() === 
       new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
       {
           var today = entries[entries.length-1];
           var baseNutrients = res.locals.baseNutrients;
           for (i = 0; i < today.nutrients.length; ++i)
           {
               today.nutrients[i].amount -= today.conversion_factors[delete_index]*baseNutrients[i];
           }
           today.food_names.splice(delete_index, 1);
           today.food_codes.splice(delete_index, 1);
           today.conversion_factors.splice(delete_index, 1);
       }
       req.user.save();
       res.json(req.user);
   }
})

module.exports = router;