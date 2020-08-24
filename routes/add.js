const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const API_KEY = process.env.API_KEY;
var Entry = require('../models/entry');
const { db } = require('../models/entry');

// energy (kcal) is calories
// retinol is vit a
// tocopherol is vit e
// search up fat limits

const tracked = ['Energy (kcal)', 'Protein', 'Retinol', 'Vitamin D', 'Tocopherol, alpha', 'Vitamin K', 
'Vitamin C', 'Thiamin', 'Riboflavin', 'Niacin', 'Vitamin B-6', 'Folate, naturally occurring', 'Vitamin B-12', 
'Calcium, Ca', 'Phosphorus, P', 'Magnesium, Mg', 'Iron, Fe', 'Zinc, Zn', 'Selenium, Se', 'Total Fat'];

router.use(express.json());

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

router.get('/', callFoodAPI, callServingSizeAPI, (req, res, next) => {
    var foods = res.locals.response;
    var serving_sizes = res.locals.serving_sizes;
    
    res.send('this is where you can add foods to today\'s entry, <br><br>' + serving_sizes + '<br><br>' + foods);
});

router.post('/', callNutrientAPI, (req, res, next) => {
    var nutrients = res.locals.nutrients_to_add;

    var date = new Date();

    var check = Entry.find(
        {
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate())
        }, (err, docs) => {}
    );

    if (!check)
    {
        // check if an entry exists for today, if not, create one, otherwise add the new food to the entry
    }
    else
    {
        var entry = new Entry(
            {
                food_codes: [req.body.food_code],
                food_names: [req.body.food_description+ ' '+ req.body.measure_name],
                nutrients: nutrients
            }
        );
        entry.save();
    }
    res.json(req.body);
});

module.exports = router;