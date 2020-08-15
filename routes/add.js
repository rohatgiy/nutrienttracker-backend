const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const API_KEY = process.env.API_KEY;
var Entry = require('../models/entry');
const { response } = require('express');
var link = "https://food-nutrition.canada.ca/api/canadian-nutrient-file/food/?lang=en&type=json";

// retinol is vit a
// tocopherol is vit e
// search up fat limits

const tracked = ['Calories', 'Protein', 'Retinol', 'Vitamin D', 'Tocopherol, alpha', 'Vitamin K', 
'Vitamin C', 'Thiamin', 'Riboflavin', 'Niacin', 'Vitamin B-6', 'Folate, naturally occurring', 'Vitamin B-12', 
'Calcium, Ca', 'Phosphorus, P', 'Magnesium, Mg', 'Iron, Fe', 'Zinc, Zn', 'Selenium, Se', 'Total Fat'];

router.use(express.json());

var callAPI = function (req, res, next) 
{
    var request = new XMLHttpRequest;
    res.locals.response = "";
    request.open("GET", link, false);
    request.onload = () => {
        res.locals.response = request.responseText;
    }
    request.send();
    next();
}

router.get('/', callAPI, (req, res, next) => {
    const {response} = res.locals;
    res.send('this is where you can add foods to today\'s entry, <br><br>' + response);
});

router.post('/add', (req, res, next) => {
    // add req.body to entry and post to db

    var request = new XMLHttpRequest;
    request.open("GET", "https://food-nutrition.canada.ca/api/canadian-nutrient-file/nutrientamount/?lang=en&type=json&id="+req.body.food_code, false);
    request.onload = () => {
        var nutrientResponse = JSON.stringify(request.responseText);
    }
    request.send();

    var nutrients_to_add = [];

    for (i = 0; i < nutrientResponse.length; ++i)
    {
        if (nutrientResponse.nutrient_value !== 0.0 && tracked.includes(nutrientResponse.nutrient_web_name))
        {
            nutrients_to_add.append({
                "nutrient": nutrient_web_name,
                "amount": nutrient_value
            })
        }
    }

    // check if an entry exists for today, if not, create one, otherwise add the new food to the entry
    // also create instance of db --> var db = mongoose.connection

    var entry = new Entry(
        {
            food_codes: food_codes.append(req.body.food_code),
            food_names: food_names.append(req.body.food_description),
            nutrients: nutrients.append(nutrients_to_add)
        }
    );
    res.json(req.body);
});

module.exports = router;