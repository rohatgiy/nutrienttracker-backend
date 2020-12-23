const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const validator = require('express-validator');
const bcrypt = require('bcrypt');
var User = require('../models/user');

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

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
    (username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, {message: { success: false, message: 'Incorrect username.' }});
            }

            bcrypt.compare(password, user.password, (err, result) => {

                if (result) {
                    console.log("logged in");
                    return done(null, user);
                }
                else {
                    console.log("login failed");
                    return done(null, false, {message: { success: false, message: "Incorrect password." }});
                }
            });
        });
    }));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

exports.login_user_post = (req, res, next) => {

    console.log('try to login');

    passport.authenticate('local', {badRequestMessage: {success: false, message: "Please enter username and password."}}, 
    function (err, user, info)
    {
        if (err)
        {
            return res.status(401).json(err)
        }
        
        if (!user)
        {
            return res.status(401).json(info)
        }

        req.logIn(user, function (err)
        {
            if (err)
            {
                return next(err)
            }
            return res.send(user)
        });
    })(req, res, next)
};

const validateUserCreation =
    [
        validator.body('firstname').trim().isLength({ min: 1 }).withMessage('Must have a firstname').isAlpha()
        .withMessage('First name can only contain letters'),

        validator.body('username').trim().isAlphanumeric().withMessage("Username can only contain letters and numbers")
        .isLength({ min: 5, max: 15 }).withMessage("Username must be between 4 and 15 characters")
            .custom((value, { req }) => {
                return new Promise((resolve, reject) => {
                    User.findOne({ username: req.body.username }, function (err, user) {
                        if (err) {
                            reject(new Error('MongoDB Atlas Error'))
                        }
                        if (Boolean(user)) {
                            reject(new Error('Username already in use'))
                        }
                        resolve(true)
                    });
                });
            }),

        validator.body('password', 'Password must be 8 or more characters').isLength({ min: 8 }),

        validator.body('conf_password', 'Passwords do not match, try again').custom(function (value, { req }) {
            if (value === req.body.password) {
                return true;
            }
            else {
                throw new Error("Passwords do not match");
            }
        }),

        validator.body('age').isIn(["11-14", "15-18", "19-24", "25-50", "51+"]),

        validator.body('gender').isIn(["male", "female"]),

        validator.check(['username', 'firstname', 'password', 'conf_password', 'age', 'gender']).escape()
    ]

exports.create_user_post = [validateUserCreation, (req, res) => {
    if (validator.validationResult(req).isEmpty())
    {
        var plainTextPassword = req.body.password;

    bcrypt.hash(plainTextPassword, 10, (err, hash) => {
        var gender = req.body.gender
        var age = req.body.age
        var nutReqs = []

        if (gender === "male")
        {
            if (age === "11-14")
            {
                nutReqs = males11to14
            }
            else if (age === "15-18")
            {
                nutReqs = males15to18
            }
            else if (age === "19-24")
            {
                nutReqs = males19to24
            }
            else if (age === "25-50")
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
            if (age === "11-14")
            {
                nutReqs = females11to14
            }
            else if (age === "15-18")
            {
                nutReqs = females15to18
            }
            else if (age === "19-24")
            {
                nutReqs = females19to24
            }
            else if (age === "25-50")
            {
                nutReqs = females25to50
            }
            else
            {
                nutReqs = femalesOver51
            }
        }

        var user = new User({
            username: req.body.username,
            password: hash,
            firstname: req.body.firstname,
            entries: [],
            requirements: nutReqs,
            age: age,
            gender: gender
        });
        user.save()
        .catch(err => {
            console.log('Error ' + err);
        }

        );
        console.log('user created')
        res.json(user);
    });
    }
    else
    {
        console.log("couldn't create user")
        res.send(validator.validationResult(req).errors[0].msg)
    }
    
}]