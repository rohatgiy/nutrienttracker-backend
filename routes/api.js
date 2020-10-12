const router = require('express').Router();
const fs = require('fs');

router.get('/:id', (req, res, next) => {
    fs.readFile('foods_formatted.json', 'utf8', (err, data) => {
        if (err)
        {
            return console.log(err)
        }
        obj = JSON.parse(data);
        var check = Number(req.params.id);
        var found = false;
        for (i = 0; i < obj.length; ++i)
        {
            if (obj[i].food_code === check)
            {
                found = true;
                res.send(obj[i]);
            }
        }
        if (!found)
        {
            res.send('not found');
        }
    })
});

router.get('/:id/nutrients', (req, res, next) => {
        fs.readFile('foods_formatted.json', 'utf8', (err, data) => {
            if (err)
            {
                return console.log(err)
            }
            obj = JSON.parse(data);
            var check = Number(req.params.id);
            var found = false;
            for (i = 0; i < obj.length; ++i)
            {
                if (obj[i].food_code === check)
                {
                    found = true;
                    res.send(obj[i].nutrients);
                }
            }
            if (!found)
            {
                res.send('not found');
            }
        })
    });

router.get('/:id/servings', (req, res, next) => {
    fs.readFile('foods_formatted.json', 'utf8', (err, data) => {
        if (err)
        {
            return console.log(err)
        }
        obj = JSON.parse(data);
        var check = Number(req.params.id);
        var found = false;
        for (i = 0; i < obj.length; ++i)
        {
            if (obj[i].food_code === check)
            {
                found = true;
                res.send(obj[i].serving_sizes);
            }
        }
        if (!found)
        {
            res.send('not found');
        }
    })
});

router.get('/:id/nutrients/:serving_index', (req, res, next) => {
    fs.readFile('foods_formatted.json', 'utf8', (err, data) => {
        if (err)
        {
            return console.log(err)
        }
        obj = JSON.parse(data);
        var check = Number(req.params.id);
        var serving = Number(req.params.serving_index)
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
                    scaled_nutrients.push({"nutrient_name": obj[i].nutrients[j].nutrient_name,
                        "nutrient_amount": obj[i].nutrients[j].nutrient_amount * obj[i].serving_sizes[serving].conversion_factor,
                        "unit": obj[i].nutrients[j].unit});
                }
                res.send(scaled_nutrients);
            }
        }
        if (!found)
        {
            res.send('not found');
        }
    })
});

module.exports = router;

