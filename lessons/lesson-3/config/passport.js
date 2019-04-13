var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;



// Configure the local strategy for use by Passport.

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
// creating new local strategy for signup

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: false
}, function (req, email, password, done) {

        User.findOne({'email': email}, function (err, user) {
            if (err){
                return done(err);
            }
            if (user){
                return done(null, false, {message:'Email is in use please try one more time'});
            }

            var newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.firstname = req.body.firstname;
            newUser.lastname = req.body.lastname;
            newUser.save(function (err, result) {
                if(err){
                    return done(err, false);
                }
                req.flash('success','Thank you for registration');
                req.flash('success','And again Thank you for registration');
                return done(null, newUser );
            });

        });

    }));

// new local strategy for signin

passport.use('local.signin', new LocalStrategy({
    usernameField:'email',
    passworField: 'password',

    session: false
},function (email, password, done) {
    User.findOne({email:email}, function (err, user) {
      if (err){
          return done(err, false);
      }
        if(!user){
          return done(err, false , {message:'Invalid Username or Password'});
        }
        if(!user.validPassword(password)){
          return done(null, false, {message:'Invalid Username or Password'});
        }
        return done(null, user);
    });

    }));
