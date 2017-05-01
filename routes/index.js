var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bloc' });
});

router.get('/signup', function(req, res, next){
  console.log("signup");
});

router.get('/profile', function(req, res, next){
  console.log("profile");
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  // failureFlash: true,
}));

module.exports = router;
