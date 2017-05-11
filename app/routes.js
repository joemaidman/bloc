module.exports = function(app, passport) {

  // Routes
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.get('/guest', guestLogin, function (req, res) {
    app.post('/login');
    res.redirect('/');
  });

  app.get('/game', isLoggedIn, function(req, res) {
    res.render('game.ejs', {
      user : req.user
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/game',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/game',
    failureRedirect : '/',
    failureFlash : true
  }));

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};

// Helpers
function guestLogin(req, res, next){
  if(req.user) return next();
  var user = new User({displayName: 'guest' + Math.random().toString() });
  user.save();
  req.logIn(user, next);
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
  return next();
  res.redirect('/');
}
