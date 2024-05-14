const passportAzureAD = require('passport-azure-ad');
const passportGoogleOAuth2 = require('passport-google-oauth20');
const {findUserByProviderIdAndProvider,createUser} = require('./database');

// Passport Configuration for Azure AD
const azureADStrategy = {
    identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    responseType: 'code',
    redirectUrl: 'http://localhost:3000/auth/azure/callback',
    responseMode: 'form_post',
    allowHttpForRedirectUrl: true, // Required during development
    scope: ['profile', 'offline_access','email', 'openid'],
};

const azureADStrategyInstance = (db)=> {
        return new passportAzureAD.OIDCStrategy(azureADStrategy,
            async (accessToken, refreshToken, profile, done) => {
                let user = await findUserByProviderIdAndProvider(db,profile.id,'azure');

                if (!user) {
                    console.dir(profile);
                    user = await createUser(db,profile._json.email,profile._json.email,profile.oid,'azure') ;
                }    
                done(null, user);
            });
};

const googleStrategyInstance = (db) => {
    return new passportGoogleOAuth2.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.dir(profile);
        let user = await findUserByProviderIdAndProvider(db,profile.id.toString(),'google')

        if (!user) {
            // If user doesn't exist, create a new user
            user = await createUser(db,profile.emails[0].value,profile.emails[0].value,profile.id,'google');
        }    
        done(null, user);
    }) ;
};


module.exports = { 
    azureADStrategyInstance,
    googleStrategyInstance
};
