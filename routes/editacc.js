const router = require('express').Router();

const males11to14 = [{"calories":2500, "protein":45, "vitamin a": 1000, "vitamin d": 10, 
"vitamin e": 10, "vitamin k": 45, "vitamin c": 50, "thiamin": 1.3, "riboflavin": 1.5, "niacin": 17, 
"vitamin b6": 0.0017, "folate": 150, "vitamin b12": 2000, "calcium": 1200, "phosphorus": 1200, "magnesium": 270, 
"iron": 12, "zinc": 15, "selenium": 40, "fat": 85}]

const females11to14 = [{"calories":2200,"protein":46, "vitamin a": 800, "vitamin d": 10, 
"vitamin e": 8, "vitamin k": 45, "vitamin c": 50, "thiamin": 1.1, "riboflavin": 1.3, "niacin": 15, 
"vitamin b6": 0.0014, "folate": 150, "vitamin b12": 2000, "calcium": 1200, "phosphorus": 1200, "magnesium": 280, 
"iron": 15, "zinc": 12, "selenium": 45, "fat": 70}]


const males15to18 = [{"calories":2200,"protein":44, "vitamin a": 800, "vitamin d": 10, 
"vitamin e": 10, "vitamin k": 65, "vitamin c": 60, "thiamin": 1.5, "riboflavin": 1.8, "niacin": 20, 
"vitamin b6": 0.002, "folate": 200, "vitamin b12": 2000, "calcium": 1200, "phosphorus": 1200, "magnesium": 400, 
"iron": 12, "zinc": 15, "selenium": 50, "fat": 95}]

const females15to18 = [{"calories":2200,"protein":44, "vitamin a": 800, "vitamin d": 10, 
"vitamin e": 8, "vitamin k": 55, "vitamin c": 60, "thiamin": 1.1, "riboflavin": 1.3, "niacin": 15, 
"vitamin b6": 0.0015, "folate": 180, "vitamin b12": 2000, "calcium": 1200, "phosphorus": 1200, "magnesium": 300, 
"iron": 15, "zinc": 12, "selenium": 50, "fat": 70}]


const males19to24 = [{"calories":2900,"protein":58, "vitamin a": 1000, "vitamin d": 10, 
"vitamin e": 10, "vitamin k": 70, "vitamin c": 60, "thiamin": 1.5, "riboflavin": 1.7, "niacin": 19, 
"vitamin b6": 0.002, "folate": 200, "vitamin b12": 2000, "calcium": 1200, "phosphorus": 1200, "magnesium": 350, 
"iron": 10, "zinc": 15, "selenium": 70, "fat": 95}]

const females19to24 = [{"calories":2200,"protein":46, "vitamin a": 800, "vitamin d": 10, 
"vitamin e": 8, "vitamin k": 60, "vitamin c": 60, "thiamin": 1.1, "riboflavin": 1.3, "niacin": 15, 
"vitamin b6": 0.0016, "folate": 180, "vitamin b12": 2000, "calcium": 1200, "phosphorus": 1200, "magnesium": 280, 
"iron": 15, "zinc": 12, "selenium": 55, "fat": 70}]


const males25to50 = [{"calories":2900,"protein":63, "vitamin a": 1000, "vitamin d": 5, 
"vitamin e": 10, "vitamin k": 80, "vitamin c": 60, "thiamin": 1.5, "riboflavin": 1.7, "niacin": 19, 
"vitamin b6": 0.002, "folate": 200, "vitamin b12": 2000, "calcium": 800, "phosphorus": 800, "magnesium": 350, 
"iron": 10, "zinc": 15, "selenium": 70, "fat": 95}]

const females25to50 = [{"calories":2200,"protein":50, "vitamin a": 800, "vitamin d": 5, 
"vitamin e": 8, "vitamin k": 60, "vitamin c": 60, "thiamin": 1.1, "riboflavin": 1.3, "niacin": 15, 
"vitamin b6": 0.0016, "folate": 180, "vitamin b12": 2000, "calcium": 800, "phosphorus": 800, "magnesium": 280, 
"iron": 15, "zinc": 12, "selenium": 55, "fat": 70}]


const malesOver51 = [{"calories":3000,"protein":63, "vitamin a": 1000, "vitamin d": 5, 
"vitamin e": 10, "vitamin k": 80, "vitamin c": 60, "thiamin": 1.2, "riboflavin": 1.4, "niacin": 15, 
"vitamin b6": 0.002, "folate": 200, "vitamin b12": 2000, "calcium": 800, "phosphorus": 800, "magnesium": 350, 
"iron": 10, "zinc": 15, "selenium": 70, "fat": 95}]

const femalesOver51 = [{"calories":1900,"protein":50, "vitamin a": 800, "vitamin d": 5, 
"vitamin e": 8, "vitamin k": 60, "vitamin c": 60, "thiamin": 1, "riboflavin": 1.2, "niacin": 13, 
"vitamin b6": 0.0016, "folate": 180, "vitamin b12": 2000, "calcium": 800, "phosphorus": 800, "magnesium": 280, 
"iron": 10, "zinc": 12, "selenium": 55, "fat": 70}]

router.get('/', (req, res, next) => {
    /*
        1. check if user is logged in
        2. fetch the user's info from db
        3. allow user to update their info
    */

    if (req.user)
    {
        res.send(req.user);
    }
    else
    {
        res.redirect('/login');
    }
});

router.post('/', (req, res, next) => {
     /*
        1. send the updated info to the db
    */
    if (req.user)
    {
        newAge = req.body.age;
        newGender = req.body.gender;
        nutReqs = [];

        if (newGender === "male")
        {
            if (newAge === "11-14")
            {
                nutReqs = males11to14
            }
            else if (newAge === "15-18")
            {
                nutReqs = males15to18
            }
            else if (newAge === "19-24")
            {
                nutReqs = males19to24
            }
            else if (newAge === "25-50")
            {
                nutReqs = males25to50
            }
            else
            {
                nutReqs = malesOver51
            }
        }
        else
        {
            if (newAge === "11-14")
            {
                nutReqs = females11to14
            }
            else if (newAge === "15-18")
            {
                nutReqs = females15to18
            }
            else if (newAge === "19-24")
            {
                nutReqs = females19to24
            }
            else if (newAge === "25-50")
            {
                nutReqs = females25to50
            }
            else
            {
                nutReqs = femalesOver51
            }
        }

        req.user.age=newAge
        req.user.gender=newGender
        req.user.requirements=nutReqs
        req.user.save();
        res.json(req.user);
    }
    else
    {
        res.redirect('/login');
    }
});

module.exports = router;