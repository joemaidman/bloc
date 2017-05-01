var PassportLocal = require('passport-local');
var LocalStrategy = PassportLocal.Strategy;
var User = require('../src/models/user');



module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passReqToCallback : true
    },
    function using(req, email, password, done) {
      if (!req.user) {
        User.findOne({ 'email': email }, function findOne(err, user) {
          if (err) return done(err);
          if (user) return done(null, false);

          // account information is in req.body
          // you can do your data validation here.
          delete req.body.password;
          user = new User(req.body);
          user.generateHash(password, function generateHash(err, hash) {
            if (err) return done(err);
            user.hash = hash;
            user.save(function save() {
              if (err) return done(err);
              done(null, user);
            });
          });
        });
      } else {
        user = req.user;
        user.generateHash(password, function generateHash(err, hash) {
          if (err) return done(err);
          user.hash = hash;
          user.save(function save() {
            if (err) return done(err);
            done(null, user);
          });
        });
      }
    }
  ));
}
