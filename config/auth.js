module.exports = {

    'facebookAuth' : {
        'clientID'      : '1965533283679974', // your App ID
        'clientSecret'  : '33061d07884e27838714886c1e3295fc', // your App Secret
        'callbackURL'   : process.env.FBCALLBACK ||  'http://localhost/auth/facebook/callback'
    }
  };
