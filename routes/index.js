var express = require('express');
var passport = require('passport');
var router = express.Router();
require('../config/passport')(passport);

var bodyParser = require('body-parser');

// module.exports = function(app, passport) {
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// };


router.get('/', function(req, res, next) {
  console.log("Hi there")
  res.render('index', { title: 'Bloc' });
});

router.get('/signup', function(req, res, next){
  console.log("signup");
});

router.get('/profile', function(req, res, next){
  console.log("profile");
});

router.post('/signup', urlencodedParser, function(req, res, next) {
        console.log('signup')
        console.log(req)
        console.log(res)
        console.log(passport.authenticate)
        // console.log(err)
        // console.log(user)
        // console.log(info)
        passport.authenticate('local-signup', function(err, user, info) {
          console.log('1')
          console.log(passport.authenticate)
            if (err) {
                console.log(err)
                return next(err); // will generate a 500 error
            }
            // Generate a JSON response reflecting authentication status
            if (! user) {
                console.log('Got the following back');
                console.log('Error: ' + err);
                console.log('User: ' + user);
                info = JSON.stringify(info);
                console.log('Info: '+ info);
                    for(var key in info) {
                        console.log(key);
                    }
                var userd = JSON.stringify(req.body);
            console.log('Request : ' + userd);
                return res.send({ success : false, message : 'authentication failed'});
            }
            return res.send({ success : true, message : 'authentication succeeded' });
          })(req, res, next);

    });

// router.post('/signup', function(req, res, next) {
//     console.log(req.url);
//     passport.authenticate('local-signup', function(err, user, info) {
//         console.log("authenticate");
//         console.log(err);
//         console.log(user);
//         console.log(info);
//     })(req, res, next);
// });

// router.post('/signup', function(){
//   passport.authenticate('local-signup', function() {
//     console.log(err)
//     successRedirect: '/profile',
//     failureRedirect: '/'
//     // failureFlash: true,
//   })
// });
module.exports = router;
