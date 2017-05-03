module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_CLIENT_ID, // your App ID
        'clientSecret'  : process.env.FACEBOOK_CLIENT_SECRET, // your App Secret
        'callbackURL'   : process.env.FACEBOOK_CALLBACK || 'http://localhost:8080/auth/facebook/callback'
    }
  };
