const express = require('express');
const passport = require('passport');

const router = express.Router();

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

