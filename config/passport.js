// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../app/models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'emails', 'displayName'],
  },

  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

      // find the user in the database based on their facebook id
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
        return done(err);

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();
          // set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = token; // we will save the token that facebook provides to the user
          newUser.facebook.displayName  = profile.displayName; // look at the passport user profile to see how names are returned
          if(profile.emails){
            if(profile.emails.length > 0){
              newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
            }
          }
          // save our user to the database
          newUser.save(function(err) {
            if (err)
            throw err;

            // if successful, return the new user
            return done(null, newUser);
          });
        }

      });
    });

  }));



  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) { // callback with email and password from our form
    var randomGuestName = 'Guest'+ (Math.round(Math.random() * 1000, 0)).toString();
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    console.log(randomGuestName);
    User.findOne({ displayName: randomGuestName }, function(err, user) {
      if (err)  return done(err);
      if (!user) {

        /* HERE, INSTEAD OF REJECTING THE AUTHENTICATION */
        // return done(null, false, { message: 'Incorrect username.' });

        /* SIMPLY CREATE A NEW USER */
        var newUser = new User();
        newUser.local.displayName = randomGuestName;
        /* AND AUTHENTICATE WITH THAT */
        newUser.save(function(err) {
          if (err)
          throw err;
          console.log("Creating a new user called: " + newUser.local.displayName);
          return done(null, newUser);
        });

      }

    });

  }));


  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
        return done(err);

        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if there is no user with that email
          // create the user
          var newUser            = new User();

          // set the user's local credentials
          newUser.local.email    = email;
          newUser.local.password = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
            if (err)
            throw err;
            return done(null, newUser);
          });
        }

      });

    });

  }));

};
