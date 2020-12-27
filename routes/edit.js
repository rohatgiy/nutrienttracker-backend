const Entry = require('../models/entry');
const fs = require('fs');
const router = require('express').Router();
const isEmpty = require('is-empty')

var setup = function (req, res, next)
{
    res.locals.delete_index = req.body.delete_index;
    console.log(req.body.delete_index)

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
        var nutrient_amounts = [];
        
        for (i = 0; i < obj.length; ++i)
        {
            
            if (obj[i].food_code === check)
            {
                for (j = 0; j < obj[i].nutrients.length; ++j)
                {
                    nutrient_amounts.push(
                        {
                            name: obj[i].nutrients[j].nutrient_name,
                            amt: obj[i].nutrients[j].nutrient_amount
                        });
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
       var entries = req.user.entries;
       var date = new Date();
   
       if (entries.length > 0 && entries[entries.length-1].date.getTime() === 
       new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
       {
           var today = entries[entries.length-1];
           var baseNutrients = res.locals.baseNutrients;
           console.log(baseNutrients)
           today.food_names.splice(delete_index, 1);
           

           if (isEmpty(today.food_names))
           {
               for (i = 0; i < today.nutrients.length; ++i)
               {
                   today.nutrients[i].amount = 0
               }
               today.food_codes.splice(delete_index, 1);
               today.conversion_factors.splice(delete_index, 1);
           }
           else
           {
                for (i = 0; i < today.nutrients.length; ++i)
                {
                    for (j = 0; j < baseNutrients.length; ++j)
                    {
                        if (today.nutrients[i].nutrient === baseNutrients[j].name)
                        {
                            today.nutrients[i].amount -= today.conversion_factors[delete_index]*baseNutrients[j].amt
                        }
                    }
                }
                today.food_codes.splice(delete_index, 1);
                today.conversion_factors.splice(delete_index, 1);
           }   
       }
       req.user.save();
       console.log("deleted")
       res.json(req.user);
   }
})

module.exports = router;