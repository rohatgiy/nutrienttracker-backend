const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const API_KEY = process.env.API_KEY;
var Entry = require('../models/entry');

// energy (kcal) is calories
// retinol is vit a
// tocopherol is vit e
// search up fat limits

const tracked = ['Energy (kcal)' /* kcal */, 'Protein' /* g */, 'Retinol' /* µg */, 'Vitamin D' /* µg */, 
'Tocopherol, alpha' /* mg */, 'Vitamin K' /* µg */, 'Vitamin C' /* mg */, 'Thiamin' /* mg */, 'Riboflavin' /* mg */, 
'Niacin' /* mg */, 'Vitamin B-6' /* mg */, 'Folate, naturally occurring' /* µg */, 'Vitamin B-12' /* µg */, 
'Calcium, Ca' /* mg */, 'Phosphorus, P' /* mg */, 'Magnesium, Mg' /* mg */, 'Iron, Fe' /* mg */, 'Zinc, Zn' /* mg */,
'Selenium, Se' /* µg */, 'Total Fat' /* g */];

var getNutrients = function (req, res, next)
{
    fs.readFile('foods_formatted.json', 'utf8', (err, data) => {
        if (err)
        {
            return console.log(err)
        }
        obj = JSON.parse(data);
        var check = Number(req.body.food_code);
        var serving = Number(req.body.serving_index);
        var found = false;
        var sendString = "";
        for (i = 0; i < obj.length; ++i)
        {
            if (obj[i].food_code === check)
            {
                found = true;
                
                scaled_nutrients = [];
                for (j = 0; j < obj[i].nutrients.length; ++j)
                {
                    scaled_nutrients.push({"nutrient": obj[i].nutrients[j].nutrient_name,
                        "amount": obj[i].nutrients[j].nutrient_amount * obj[i].serving_sizes[serving].conversion_factor,
                        "unit": obj[i].nutrients[j].unit});
                }
                food_obj = {"food_name": obj[i].food_name,
                        "food_code": obj[i].food_code,
                        "serving_size": obj[i].serving_sizes[serving].serving_description,
                        "nutrients": scaled_nutrients};
                res.locals.food_obj = food_obj;
                next();
            }
        }
        if (!found)
        {
            res.locals.food_obj = {
                "error": "food not found"
            }
            next();
        }
    })
}

router.use(express.json());

router.get('/', (req, res, next) => {
    if (req.user)
    {
        res.send('you can add food here');
    }
    else
    {
        res.redirect('/login');
    }
});


router.post('/', getNutrients, (req, res, next) => {
    if (!req.user)
    {
        res.redirect('/login');
    }
    else
    {
        var nutrients = res.locals.food_obj.nutrients;
        var today_entries = req.user.entries;

        var date = new Date();

        if (today_entries.length > 0 && today_entries[today_entries.length-1].date.getTime() === new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
        {
            today_entries[today_entries.length-1].food_codes.push(res.locals.food_obj.food_code);
            today_entries[today_entries.length-1].food_names.push(res.locals.food_obj.food_name+ ', '+ res.locals.food_obj.serving_size);
            for (i = 0; i < nutrients.length; ++i)
            {
                for (j = 0; j < req.user.entries[req.user.entries.length-1].nutrients.length; ++j)
                {
                    if (nutrients[i].nutrient === req.user.entries[req.user.entries.length-1].nutrients[j].nutrient)
                    {
                        // console.log('in db: ' + req.user.entries[req.user.entries.length-1].nutrients[j].amount);
                        // console.log('to add: ' + nutrients[i].amount);
                        req.user.entries[req.user.entries.length-1].nutrients[j].amount += nutrients[i].amount;
                    }
                }
            }
            req.user.save();          
        }
        else
        {
            var entry = new Entry(
                {
                    food_codes: [res.locals.food_obj.food_code],
                    food_names: [res.locals.food_obj.food_name+ ', '+ res.locals.food_obj.serving_size],
                    nutrients: nutrients
                }
            );
            req.user.entries.push(entry);
            req.user.save();
        }
        res.json(req.user);
    }
});

module.exports = router;