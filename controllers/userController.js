const passport = require('passport');
var LocalStrategy = require('passport').Strategy;
const bcrypt = require('bcrypt');
var User = require('../models/user');

exports.login_user_post = passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if (err) { return done(err); }
            if (!user) { 
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(passowrd)) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);

        });
}));

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