const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const API_KEY = process.env.API_KEY;
var Entry = require('../models/entry');
var link = "https://food-nutrition.canada.ca/api/canadian-nutrient-file/food/?lang=en&type=json";

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
    var entry = new Entry();
    res.json(req.body);
});

module.exports = router;