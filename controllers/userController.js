const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var User = require('../models/user');

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

exports.login_user_post = (req, res) => {

    console.log('try to login');

    passport.authenticate('local', (err, user, info) => {
        if (err)
        {
            return res.status(401).json(err); 
        }
        if (user)
        {
            console.log('logged in');
            console.log(user);
            return res.status(200).json({
                'status': 'success',
                'user': req.body.username,
                'password': req.body.password
            });
        }
        else
        {
            return res.status(401).json(info);
        }
    })(req, res)

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