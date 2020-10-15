const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const validator = require('express-validator');
const bcrypt = require('bcrypt');
var User = require('../models/user');
// only did 11-14 males, maybe don't do this or find a better way to do it
//const requirements = [[{"calories":2500,"protein":45, "vitamin a": 1000, "vitamin d": 10, "vitamin e": 10, "vitamin k": 45, "vitamin c": 50, "thiamin": 1.3, "riboflavin": 1.5, "niacin": 16, "vitamin b6": 1.7, "folate": 150, "vitamin b12": 2, "calcium": 1200, "phosphorus": 1200, "magnesium": 270, "iron": 12, "zinc": 15, "selenium": 40}],[]]

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
    (username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            bcrypt.compare(password, user.password, (err, result) => {

                if (result) {
                    console.log("logged in");
                    return done(null, user);
                }
                else {
                    console.log("login failed");
                    return done(null, false, { message: 'Incorrect password.' });
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

exports.login_user_post = (req, res) => {

    console.log('try to login');

    passport.authenticate('local', {
        successRedirect: '/add',
        failureRedirect: '/login'
    })(req, res)

    // , (err, user, info) => {
    //     if (err)
    //     {
    //         return res.status(401).json(err); 
    //     }
    //     if (user)
    //     {
    //         console.log(user);
    //         return res.status(200).json({
    //             "status": "success",
    //             "user": req.body.username
    //         });
    //     }
    //     else
    //     {
    //         return res.status(401).json(info);
    //     }
    // }

}

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
        var user = new User({
            username: req.body.username,
            password: hash,
            firstname: req.body.firstname,
            entries: [],
            age: req.body.age,
            gender: req.body.gender
        });
        user.save()
        .catch(err => {
            console.log('Error ' + err);
        }

        );
        console.log('user created')
        res.json(req.body);
    });
    }
    else
    {
        console.log("couldn't create user")
        res.send(validator.validationResult(req).errors[0].msg)
    }
    
}]