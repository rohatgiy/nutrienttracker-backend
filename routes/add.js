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
        console.log(req.body.food_code, req.body.serving_index)

        if (req.body.food_code === null)
        {
            res.send({success: false, message: "Please choose a food and serving size."})
        }

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
                        "conversion_factor": obj[i].serving_sizes[serving].conversion_factor,
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
        res.send(req.user)
    }
    else
    {
        res.send({});
    }
});


router.post('/', getNutrients, (req, res, next) => {
    if (!req.user)
    {
        console.log("not logged in")
        res.end()
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
            today_entries[today_entries.length-1].conversion_factors.push(res.locals.food_obj.conversion_factor);
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
                    conversion_factors: [res.locals.food_obj.conversion_factor],
                    food_names: [res.locals.food_obj.food_name+ ', '+ res.locals.food_obj.serving_size],
                    nutrients: nutrients
                }
            );
            req.user.entries.push(entry);
            req.user.save();
        }
        res.send({name: req.user.firstname, success: true, message: "Added!"});
    }
});

module.exports = router;