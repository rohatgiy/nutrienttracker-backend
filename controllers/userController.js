const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var User = require('../models/user');
// only did 11-14 males, maybe don't do this or find a better way to do it
//const requirements = [[{"calories":2500,"protein":45, "vitamin a": 1000, "vitamin d": 10, "vitamin e": 10, "vitamin k": 45, "vitamin c": 50, "thiamin": 1.3, "riboflavin": 1.5, "niacin": 16, "vitamin b6": 1.7, "folate": 150, "vitamin b12": 2, "calcium": 1200, "phosphorus": 1200, "magnesium": 270, "iron": 12, "zinc": 15, "selenium": 40}],[]]

passport.use(new LocalStrategy({usernameField:'username', passwordField:'password'},
    (username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if (err) { return done(err); }
            if (!user) { 
                return done(null, false, { message: 'Incorrect username.' });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                
                if (result)
                {
                    console.log("logged in");
                    return done(null, user);
                }
                else
                {
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

exports.create_user_post = (req, res) => {
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
    
        res.json(req.body);
    });
}