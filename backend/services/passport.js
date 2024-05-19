const passportAzureAD = require('passport-azure-ad');
const passportGoogleOAuth2 = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
const {findUserByProviderIdAndProvider,createUser} = require('./database');
const crypto = require('crypto');

// Passport Configuration for Azure AD
const azureADStrategy = {
    identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    responseType: 'code',
    redirectUrl: process.env.DOMAIN+'/auth/azure/callback',
    responseMode: 'form_post',
    allowHttpForRedirectUrl: true, // Required during development
    scope: ['profile', 'offline_access','email', 'openid'],
};

const azureADStrategyInstance = (db)=> {
        return new passportAzureAD.OIDCStrategy(azureADStrategy,
            async (accessToken, refreshToken, profile, done) => {
                let userObj = await findUserByProviderIdAndProvider(db,profile.id,'azure');

                if (!userObj) {
                    userId = await createUser(db,profile._json.email,null,null,profile._json.email,profile.oid,'azure') ;
                }else{
                    userId = userObj.id;
                }
                done(null, userId);
            });
};

const googleStrategyInstance = (db) => {
    return new passportGoogleOAuth2.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.DOMAIN+'/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        let userObj = await findUserByProviderIdAndProvider(db,profile.id.toString(),'google')
        
        if (!userObj) {
            // If user doesn't exist, create a new user
            userId = await createUser(db,profile.emails[0].value,null,null,profile.emails[0].value,profile.id,'google');
        }else{
            userId = userObj.id;
        }
        done(null, userId);
    }) ;
};

const localStrategy = (db)=> new LocalStrategy(function verify(username, password, cb) {
  db.get('SELECT * FROM user WHERE username = ?', [ username ], function(err, user) {
    if (err) { return cb(err); }
    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    let bufferHashedPassword = Buffer.from(user.hashed_password, 'hex');

    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(bufferHashedPassword, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user.id);
    });
  });
});

module.exports = { 
    azureADStrategyInstance,
    googleStrategyInstance,
    localStrategy
};
