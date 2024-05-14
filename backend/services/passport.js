const passportAzureAD = require('passport-azure-ad');
const passportGoogleOAuth2 = require('passport-google-oauth20');

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

const azureADStrategyInstance = (prisma)=> {
        return new passportAzureAD.OIDCStrategy(azureADStrategy,
            async (accessToken, refreshToken, profile, done) => {
                let user = await prisma.user.findFirst({
                    where: {
                        providerId: profile.id,
                        provider: 'azure',
                    },
                });

                if (!user) {
                    console.dir(profile);
                    user = await prisma.user.create({
                        data: {
                            username: profile._json.email,
                            email: profile._json.email,
                            providerId: profile.oid,
                            provider: 'azure',
                        },
                    });
                }    
                done(null, user);
            });
};

const googleStrategyInstance = (prisma) => {
    return new passportGoogleOAuth2.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.dir(profile);
        let user = await prisma.user.findFirst({
            where: {
                providerId: profile.id.toString(),
                provider: 'google',
            },
        });

        if (!user) {
            // If user doesn't exist, create a new user
            user = await prisma.user.create({
                data: {
                    username: profile.emails[0].value,
                    email: profile.emails[0].value,
                    providerId: profile.id,
                    provider: 'google',
                },
            });
        }    
        done(null, user);
    }) ;
};


module.exports = { 
    azureADStrategyInstance,
    googleStrategyInstance
};
