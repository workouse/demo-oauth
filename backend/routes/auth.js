const express = require('express');
const passport = require('passport');
const {findUserByUsername} = require('../services/database');

const router = express.Router();

router.post('/login', async (req, res) => {
    //get username 
    let username = req.body.username; 
    let user = await findUserByUsername(req.db,username);
    if(!user){
        res.json({
            error: 'User not found'
        });
        res.end();
        return;
    }
    

    if(user.provider=="local"){
        res.json({
            ask_password: true
        });
    }
    if(user.provider=="google"){
        res.json({
            redirect: '/auth/google' 
        });
    }
    if(user.provider=="azure"){
        res.json({
            redirect: '/auth/azure' 
        });
    }

});
router.post('/login/password',
    passport.authenticate('local', { 
        failureRedirect: '/login' ,
    }),
    function(req,res){
        res.json({
            message: 'Logged in successfully'
        });
    }
);
// Authentication route for Azure AD
router.get('/azure', passport.authenticate('azure-ad', {
  successRedirect: '/',
  failureRedirect: '/',
}));

router.post('/azure/callback', passport.authenticate('azure-ad', {
  successRedirect: '/',
  failureRedirect: '/',
}));

// Authentication route for Google OAuth2
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/',
}));

// Logout route
router.get('/logout', (req, res) => {
    req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;

