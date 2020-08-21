const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var User = require('../models/user');

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({username: username}, (err, user) => {
            if (err) { return done(err); }
            if (!user) { 
                return done(null, false, { message: 'Incorrect username.' });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (err)
                {
                    return done(err);
                }
                else
                {
                    if (result)
                    {
                        return done(null, user);
                    }
                    else
                    {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                }
            });
        });
}));

exports.login_user_post = (req, res) => {

    passport.authenticate('local', 
    {successRedirect: '/test/success', failureRedirect: '/test/failure', failureFlash: false});

    res.json(req.body);

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