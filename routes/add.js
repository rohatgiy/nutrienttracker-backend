const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const API_KEY = process.env.API_KEY;
var Entry = require('../models/entry');
var User = require('../models/user');
const { db } = require('../models/entry');
const e = require('express');
const user = require('../models/user');

// energy (kcal) is calories
// retinol is vit a
// tocopherol is vit e
// search up fat limits

const tracked = ['Energy (kcal)' /* kcal */, 'Protein' /* g */, 'Retinol' /* µg */, 'Vitamin D' /* µg */, 
'Tocopherol, alpha' /* mg */, 'Vitamin K' /* µg */, 'Vitamin C' /* mg */, 'Thiamin' /* mg */, 'Riboflavin' /* mg */, 
'Niacin' /* mg */, 'Vitamin B-6' /* mg */, 'Folate, naturally occurring' /* µg */, 'Vitamin B-12' /* µg */, 
'Calcium, Ca' /* mg */, 'Phosphorus, P' /* mg */, 'Magnesium, Mg' /* mg */, 'Iron, Fe' /* mg */, 'Zinc, Zn' /* mg */,
'Selenium, Se' /* µg */, 'Total Fat' /* g */];

var callFoodAPI = function (req, res, next) 
{
    var request = new XMLHttpRequest;
    res.locals.response = "";
    request.open("GET", "https://food-nutrition.canada.ca/api/canadian-nutrient-file/food/?lang=en&type=json", false);
    request.onload = () => {
        res.locals.response = request.responseText;
    }
    request.send();
    next();
}

var callServingSizeAPI = function (req, res, next)
{
    var request = new XMLHttpRequest;
    res.locals.serving_sizes = "";
    request.open("GET", "https://food-nutrition.canada.ca/api/canadian-nutrient-file/servingsize/?lang=en&type=json", false);
    request.onload = () => {
        res.locals.serving_sizes = request.responseText;
    }
    request.send();
    next();
}

var callNutrientAPI = function(req, res, next)
{
    var request = new XMLHttpRequest;
    var nutrientResponse= "";
    request.open("GET", "https://food-nutrition.canada.ca/api/canadian-nutrient-file/nutrientamount/?lang=en&type=json&id="+req.body.food_code, false);
    request.onload = () => {
        nutrientResponse = JSON.parse(request.responseText);
    }
    request.send();

    res.locals.nutrients_to_add = [];

    for (i = 0; i < nutrientResponse.length; ++i)
    {
        if (nutrientResponse[i].nutrient_value !== 0.0 && tracked.includes(nutrientResponse[i].nutrient_web_name))
        {
            res.locals.nutrients_to_add.push({
                "nutrient": nutrientResponse[i].nutrient_web_name,
                "amount": nutrientResponse[i].nutrient_value*req.body.conversion_factor_value
            })
        }
    }
    res.locals.nutrients_to_add = res.locals.nutrients_to_add;
    next();
}


router.use(express.json());

router.get('/', callFoodAPI, callServingSizeAPI, (req, res, next) => {
    if (req.user)
    {
        var foods = res.locals.response;
        var serving_sizes = res.locals.serving_sizes;

        res.send('you can add food here');
    }
    else
    {
        res.redirect('/login');
    }
    
    
    //res.send('this is where you can add foods to today\'s entry, <br><br>' + serving_sizes + '<br><br>' + foods);
});

router.post('/', callNutrientAPI, (req, res, next) => {
    if (!req.user)
    {
        res.redirect('/login');
    }
    else
    {
        var nutrients = res.locals.nutrients_to_add;
        var today_entries = req.user.entries;

        var date = new Date();

        if (today_entries.length > 0 && today_entries[today_entries.length-1].date.getTime() === new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
        {
            today_entries[today_entries.length-1].food_codes.push(req.body.food_code);
            today_entries[today_entries.length-1].food_names.push(req.body.food_description+ ', '+ req.body.measure_name);
            for (i = 0; i < nutrients.length; ++i)
            {
                for (j = 0; j < req.user.entries[req.user.entries.length-1].nutrients.length; ++j)
                {
                    if (nutrients[i].nutrient === req.user.entries[req.user.entries.length-1].nutrients[j].nutrient)
                    {
                        console.log('in db: ' + req.user.entries[req.user.entries.length-1].nutrients[j].amount);
                        console.log('to add: ' + nutrients[i].amount);
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
                    food_codes: [req.body.food_code],
                    food_names: [req.body.food_description+ ', '+ req.body.measure_name],
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